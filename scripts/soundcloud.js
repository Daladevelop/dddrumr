
			var counter=0;
			var soundcloudSounds = 0; 

			function soundcloud_play()
			{
				soundcloudSounds.eq(counter)[0].play();
				soundcloudSounds.eq(counter)[0].volume;
			}

			function soundcloud_pause()
			{
				soundcloudSounds.eq(counter)[0].pause();
			}

			function soundcloud_next()
			{
				if(soundcloudSounds.eq(counter+1)[0] == null)
				{
						counter = 0;
				}
				else
				{
					counter++;
				}
				soundcloudSounds.eq(counter)[0].play();
				soundcloudSounds.eq(counter-1)[0].pause();

			}

			function soundcloud_prev()
			{
				if(soundcloudSounds.eq(counter-1)[0] == null)
				{
					counter = soundcloudSounds.length ;
				}
				else
				{
					counter--;
				}
				soundcloudSounds.eq(counter)[0].play();
				soundcloudSounds.eq(counter+1)[0].pause();
			}

			function getSoundcloud(){

				SC.initialize({
					client_id: "537176f93040ef34102aecb4bf99639d"

				});

				SC.get("/tracks?limit=5&tags=acapella&bpm[from]="+ parseInt(bpm-10) + "&bpm[to]=" + parseInt(bpm+10), function(soundcloudSongs){
					$.each(soundcloudSongs, function () {
						var audio = $('<audio>', {
							class: 'soundcloudsong'
							});		
						var link = this.stream_url + "?client_id=537176f93040ef34102aecb4bf99639d";
						audio.append($('<source>', {
							src: link,
							type: 'audio/mp3' 	
					
							}));
						$('body').append(audio);
						});

					soundcloudSounds = $('.soundcloudsong');


					});
			}

