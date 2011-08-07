var playing = 0;
var beat = 1;
var bpm = 120;
var sounds = ['sounds/kick','sounds/snare','sounds/hihat','sounds/cowbell', 'sounds/tom1', 'sounds/tom2'];

$(document).ready(function() {
	init(16, sounds.length);
	play(bpm);
});

function init(b, s) {
	var frm = $('form');
	var bdy = $('body');
	
	// Add audio elements.
	for(var a = 0; a < b * s; a++) {
		var audio = $('<audio>', {
			id: 'a' + a
		});
		
		var f = sounds[a % sounds.length];
		
		audio.append($('<source>', {
			src: f + '.ogg',
			type: 'audio/ogg'
		}));
		
		audio.append($('<source>', {
			src: f + '.mp3',
			type: 'audio/mp3'
		}));
		
		audio.get(0).load();
		
		bdy.append(audio);
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

		frm.append(beat);
	}
	
	// Add controls.
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
		return false;
	});

	var button_soundcloud_prev = $('<a href="#" class="button left">').html('<').click(function(){
		count--;

			});	
	var button_soundcloud = $('<a href="#" class="button middle ">').html('Next soundcloud song').click(function(){
				getSoundcloud();
				return false; 
			});
	var button_soundcloud_play = $('<a href="#" class="button middle">').html('play').click(function(){
				if(this.html() == "pause")
				{
					this.html("play");
					soundcloud_play();
				}
				else
				{
					this.html("pause");
					soundcloud_pause();
				}
			});	
	var button_soundcloud_next = $('<a href="#" class="button right">').html('>').click(function(){
		count++;

			});	
	$('.buttons')
		.append(range)
		.append(button_play)
		.append(button_stop)
		.append(button_clear)
		.append(button_soundcloud_prev)
		.append(button_soundcloud)
		.append(button_soundcloud_next);
	
	if(range.get(0).type != 'text') {
		$('.buttons').append($('<span id="range">').html(bpm + ' BPM'));
	}
	
	$('#share').click(function() {
		save();
		return false;
	});

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
	
	$('div.beat input[type="checkbox"]').attr('checked', false);
}

function load(pattern) {
	stop();
	
	bpm = pattern['bpm'];
	$('input[type="range"]').val(pattern['bpm'])
	
	$('div.beat').each(function(index, element) {
		for(var i = 0; i < pattern['check'][index].length; i++) {
			$(element).find('input[value="' + pattern['check'][index][i] + '"]').attr('checked', true);
		}
	})
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
			var audio = $('#a' + ((beat * sounds.length) + parseInt(this.value) - sounds.length))[0];
			audio.currentTime = 0;
			audio.play();
		}).get();
	beat = (beat % 16) + 1;
	play(parseInt($('input[type="range"]').val()));
}
