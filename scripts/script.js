$(document).ready(function() {
	initialize(16, 2);
	play();
});

function initialize(beats, sounds) {
	var frm = $('form');
	var bdy = $('body');
	
	// Add audio elements.
	for(var a = 0; a < beats * sounds; a++) {
		var audio = $('<audio>', {
			id: 'a' + a
		});
		
		audio.append($('<source>', {
			src: 'horse.ogg',
			type: 'audio/ogg'
		}));
		
		audio.append($('<source>', {
			src: 'horse.mp3',
			type: 'audio/mp3'
		}));
		
		bdy.append(audio);
	}
	
	// Add checkboxes.
	for(var i = 0; i < beats; i++) {
		var beat = $('<div>', {
			class: 'beat'
		});
		
		for(var j = 0; j < sounds; j++) {
			var cb = $('<input>', {
				type: 'checkbox',
				value: j
			});
			var lbl = $('<label>');
			
			beat.append(cb);
			beat.append(lbl);
		}
		
		frm.append(beat);
	}
}