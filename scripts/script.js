var playing = 0;
var beat = 1;
var bpm = 120;
var sound_set = 0;
var sounds = Array();
var shortURL = '';
sounds[0] = ['sounds/kick','sounds/snare','sounds/hihat','sounds/cowbell','sounds/tom1','sounds/tom2','sounds/clap'];
sounds[1] = ['sounds/cowbell','sounds/clap'];

$(document).ready(function() {
	init(16, sounds[sound_set].length);
	
	if(location.hash.length > 1) {
		load(location.hash.replace('#', ''));
	}
	
	play(bpm);
});

function init(b, s) {
	add_grid(b, s);
	add_buttons();
}

function add_grid(b, s) {
	var form = $('<form>');
	var body = $('body');
	
	// Reset.
	form.html('');
	$('audio').remove();
	
	// Add audio elements.
	for(var a = 0; a < b * s; a++) {
		var audio = $('<audio>', {
			id: 'a' + a
		});
		
		var f = sounds[sound_set][a % sounds[sound_set].length];
		
		audio.append($('<source>', {
			src: f + '.ogg',
			type: 'audio/ogg'
		}));
		
		audio.append($('<source>', {
			src: f + '.mp3',
			type: 'audio/mp3'
		}));
		
		body.append(audio);
	}
	
	// Add checkboxes.
	for(var i = 0; i < b; i++) {
		var beat = $('<div>').addClass('beat');
		
		for(var j = 0; j < s; j++) {
			var cb = $('<input>', {
				type: 'checkbox',
				value: j,
				id: 'chk' + i + j
			});
			var lbl = $('<label>', {
				'for': 'chk' + i + j
			});

			beat.append(cb);
			beat.append(lbl);
		}

		form.append(beat);
	}
	
	$('footer').before(form);
}

function add_buttons() {
	var buttons = $('<div>').addClass('buttons');
	
	var range = $('<input>', {
		type: 'range',
		min: 40,
		max: 200,
		value: bpm
	}).change(function() {
		var $this = $(this);
		var slider_value = $('#range');
		
		bpm = $this.val();
		
		if(slider_value.length != 0) {
			slider_value.html($this.val() + ' BPM');
		}
	});
	
	var select_sound_set = $('<select>').change(function() {
		stop();
		
		sound_set = $(this).val();
		
		add_grid(16, sounds[sound_set].length);
		play(parseInt($('input[type="range"]').val()));
		
		return false;
	});
	
	for(var i = 0; i < sounds.length; i++) {
		var option = $('<option>')
			.attr('value', i)
			.html(i);
		
		if(i == 0) {
			option.attr('selected', true);
		}
		
		select_sound_set.append(option);
	}
	
	var button_demo = $('<a id="demo" href="#" class="button left">').html('Demo').click(function() {
		load('eyJicG0iOiIxNDIiLCJjaGVjayI6W1siMCIsIjMiXSxbXSxbIjAiLCIyIl0sWyIwIiwiNCJdLFsiMSIsIjMiXSxbIjAiXSxbIjIiXSxbIjAiXSxbIjMiXSxbIjAiXSxbIjIiXSxbIjAiLCI1Il0sWyIxIiwiMyJdLFtdLFsiMiIsIjYiXSxbIjAiLCI2Il1dfQ==');
		play(bpm);
		return false;
	});
	
	var button_about = $('<a id="about" href="#about_box" class="button middle">').html('About');
	
	var button_share = $('<a id="share" href="#share_pane" class="button right">').html('Share').click(function() {
		location.hash = save();
		urlShorten(location.href);
		return false;
	});
	
	var twitter = $('<li class="twitter"><span>t</span> <a href="#" class="twitter">Post to Twitter</a></li>');
	var facebook = $('<li class="facebook"><span>f</span> <a href="#" class="facebook">Post to Facebook</a></li>');
	
	button_share.append(
		$('<div id="share_pane">').append($('<ul>')
			.append(twitter)
			.append(facebook))
	);
	
	var button_play = $('<a href="#" class="button left">').html('Play').click(function() {
		play(parseInt($('input[type="range"]').val()));
		return false;
	});
	
	var button_stop = $('<a href="#" class="button middle">').html('Stop').click(function() {
		stop();
		return false;
	});
	
	var button_clear = $('<a href="#" class="button right">').html('Clear').click(function() {
		$('div.beat input[type="checkbox"]').attr('checked', false);
		location.hash = '';
		return false;
	});

	var button_soundcloud_prev = $('<a href="#" class="button left">').html('<').click(function(){
		soundcloud_prev();
		return false;
	});
	
	var button_soundcloud = $('<a href="#" class="button middle ">').html('Load song from SoundCloud').click(function(){
		getSoundcloud();
		return false; 
	});
	
	var button_soundcloud_play = $('<a href="#" class="button middle">').html('Play').click(function(){
		if(this.innerHTML == 'Pause') {
			this.innerHTML = 'Play';
			soundcloud_pause();
		} else {
			this.innerHTML = 'Pause';
			soundcloud_play();
		}
		
		return false;
	});	
	
	var button_soundcloud_next = $('<a href="#" class="button right">').html('>').click(function(){
		soundcloud_next();
		return false;
	});
	
	buttons
		.append(button_demo)
		.append(button_about)
		.append(button_share)
		.append(range)
		.append(button_play)
		.append(button_stop)
		.append(button_clear)
		.append(button_soundcloud_prev)
		.append(button_soundcloud)
		.append(button_soundcloud_play)
		.append(button_soundcloud_next)
		.append(select_sound_set);
	
	if(range.get(0).type != 'text') {
		buttons.append($('<span id="range">').html(bpm + ' BPM'));
	}
	
	$('#about_box').click(function() {
		history.go(-1);
		return false;
	});
	
	$('header').after(buttons);
}

function save() {
	stop();
	
	var pattern = {
		'bpm': bpm,
		'check': []
	};
	
	$('div.beat').each(function(index, element) {
		pattern['check'][index] = new Array();
		
		$(element).find('input:checked').each(function() {
			pattern['check'][index].push($(this).val());
		});
	}).get();
	
	return btoa(JSON.stringify(pattern));
}

function load(hash) {
	stop();
	
	pattern = JSON.parse(atob(hash));
	
	$('input[type="range"]').val(pattern['bpm'])
	
	$('div.beat').each(function(index, element) {
		for(var i = 0; i < pattern['check'][index].length; i++) {
			$(element).find('input[value="' + pattern['check'][index][i] + '"]').attr('checked', true);
		}
	})
	
	$('input[type="range"]').change();
}

function play(bpm) {
	if(bpm.toString().search(/^-?[0-9]+$/) == 0 && bpm >= 40 && bpm <= 200) {
		stop();
		playing = setInterval('trigger(beat)', (60000 / bpm) / 4);
	}
}

function stop() {
	clearInterval(playing);
}

function trigger() {
	var beats = $('div.beat').removeClass('playing');
	var cb = beats.eq(beat - 1)
		.addClass('playing')
		.find('input:checked').each(function() {
			var audio = $('#a' + ((beat * sounds[sound_set].length) + parseInt(this.value) - sounds[sound_set].length))[0];
			audio.currentTime = 0;
			audio.play();
		}).get();
	beat = (beat % 16) + 1;
	play(parseInt($('input[type="range"]').val()));
}

function urlShorten(url) {
	url = encodeURIComponent(url);
	$.getJSON('http://dvlp.se/new/?url=' + url + '&api=3&callback=?', function(ret) {
			shortURL = ret.URI;
			var message = escape('I\'ve created a beat with ddDrumr. Check it out! ');
			message = message + encodeURIComponent(shortURL) + escape(' #daladevelop ') + encodeURIComponent('http://daladevelop.se');
			$('#share_pane .twitter a').attr('href', 'http://twitter.com?status=' + message);
			$('#share_pane .facebook a').attr('href', 'http://www.facebook.com/sharer.php?u=' + message);
			$('#share_pane').toggleClass('target');
		}
	);
}
