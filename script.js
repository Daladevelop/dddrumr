var playing = 0;
var beat = 1;
var sounds = ['sounds/kick','sounds/snare','sounds/hihat','sounds/cowbell'];
var bpm = 60;

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
		
		var f = sounds[a % 4];
		
		audio.append($('<source>', {
			src: f + '.ogg',
			type: 'audio/ogg'
		}));
		
		audio.append($('<source>', {
			src: f + '.mp3',
			type: 'audio/mp3'
		}));
		
		bdy.append(audio);
	}
	
	// Add checkboxes.
	for(var i = 0; i < b; i++) {
		var beat = $('<div>', {
			class: 'beat'
		});
		
		for(var j = 0; j < s; j++) {
			var cb = $('<input>', {
				type: 'checkbox',
				value: j
			});
			
			var lbl = $('<label>')
				.append(cb);
			
			beat.append(lbl);
		}
		
		frm.append(beat);
	}
	
	// Add controls.
	var range = $('<input>', {
		type: 'range',
		min: 40,
		max: 200,
		value: 60
	}).change(function() {
		var $this = $(this);
		var slider_value = $('#range');
		
		if(slider_value.length == 0) {
			$this.after($('<span id="range">').html($this.val() + ' BPM'));
		} else {
			slider_value.html($this.val() + ' BPM');
		}
	});
	
	var controls = $('<div id="controls">')
		.append(range);
		
	frm.before(controls);
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
			var audio = $('#a' + ((beat * 4) + parseInt(this.value) - 4))[0];
			audio.currentTime = 0;
			audio.play();
		}).get();
	beat = (beat % 16) + 1;
	play(parseInt($('input[type="range"]').val()));
}