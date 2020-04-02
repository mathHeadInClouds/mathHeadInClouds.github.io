function createCinema(){
	var nbsp = Unicode.nbsp; 
	var screening = null;
	var movie = null;
	var MoviePlayerUI = fiat.dom.fiat([{
		updatePlayLabel: function($ARGS){
			var elt = this.instance.nodes.buttons.toggle;
			elt.textContent = screening.isPlaying() ? 'pause' : 'continue';
		},
		updateDirectionLabel: function($ARGS){
			var elt = this.instance.nodes.buttons.toggleDirection;
			elt.textContent = screening.isForwards() ? 'forwards' : 'backwards';
		},
		updatePositionLabel: function($ARGS){
			var elt = this.instance.nodes.positionLabel;
			elt.textContent = Math.round(screening.getPosition()) + '/' + Math.round(movie.intervalLength());
		},
		updateTimeLabel: function($ARGS){
			var elt = this.instance.nodes.timeLabel;
			elt.textContent = Math.round(screening.getTimePosition()) + '/' + Math.round(screening.getDuration());
		},
		toggle: function($ARGS, evt, elt, lib, key, ancestorData){
			screening.togglePlay();
			lib.updatePlayLabel();
		},
		toggleDirection: function($ARGS, evt, elt, lib, key, ancestorData){
			screening.toggleDirection();
			lib.updateDirectionLabel();
		},
		sliderChange: function($ARGS, evt, elt, lib, key, ancestorData){
			screening.setPosition(+elt.value);
		},
		slower: function($ARGS, evt, elt, lib, key, ancestorData){ screening.setDuration(screening.getDuration()*1.25); },
		faster: function($ARGS, evt, elt, lib, key, ancestorData){ screening.setDuration(screening.getDuration()*0.8); },
		body: function(div, button, span, input, table, tr, td){
			return div(
				div.K(['info'])(nbsp),
				div.K(['timeLabel'])(nbsp), div.K(['positionLabel'])(nbsp),
				div.K(['controls'])(
					button.K(['buttons','toggle'])('play').E('click', 'toggle').s('width')('90px').s('display')('inline-block'),
					button.K(['buttons','toggleDirection'])('forwards').E('click', 'toggleDirection').s('width')('90px').s('display')('inline-block'),
					button.K(['buttons','slower'])('slower').E('click', 'slower'),
					button.K(['buttons','faster'])('faster').E('click', 'faster')
				),
				input.K(['slider']).A({type: 'range', step: 0.1})
					.p('value')(0).s('width')('1000px').E('input', 'sliderChange'),
				div.K(['movie'])
			);
		}
	}]).body.setRoot().fn.append();
	MoviePlayerUI.setMovie = function setMovie(movieArg, duration){
		movie = movieArg;
		MoviePlayerUI.movie = movie;
		screening = movie.createScreening({
			duration: duration,
			onFinish: function(){
				MoviePlayerUI.library.updateDirectionLabel();
				MoviePlayerUI.library.updatePlayLabel();
			},
			onUpdate: function(manualChange){
				MoviePlayerUI.library.updateTimeLabel();
				MoviePlayerUI.library.updatePositionLabel();
				if (!manualChange){
					MoviePlayerUI.nodes.slider.value = screening.getPosition();
				}
			}
		});
		(function(slider){
			slider.min = 0;
			slider.max = movie.highPosition;
			slider.value = 0;
		})(MoviePlayerUI.nodes.slider);
		screening.setPosition(0);
		MoviePlayerUI.screening = screening;
	};
	return MoviePlayerUI;
}