"use strict";
var App, sine = null;
// https://www.karajanmusictech.com/
// https://www.karajanmusictech.com/speaker/
// https://t.me/joinchat/C08wpldQFk11B2v4imUr-w?mc_cid=65f8cec4fd&mc_eid=
// http://themindshift.tv/ entrepreneur's kitchen
// https://stackoverflow.com/questions/34708980/generate-sine-wave-and-play-it-in-the-browser
// https://stackoverflow.com/questions/37459231/webaudio-seamlessly-playing-sequence-of-audio-chunks
// https://stackoverflow.com/questions/29086039/does-calling-stop-on-a-source-node-trigger-an-ended-event
// https://stackoverflow.com/questions/27846392/access-microphone-from-a-browser-javascript
// https://stackoverflow.com/questions/17648819/how-can-i-stop-a-web-audio-script-processor-and-clear-the-buffer
// https://stackoverflow.com/questions/12407321/navigator-getusermedia
// https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
// https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode/onended
// https://teropa.info/blog/2016/08/10/frequency-and-pitch.html
// https://www.html5rocks.com/en/tutorials/webaudio/intro/
// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
// https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode
// https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices


// http://mathheadinclouds.com/phuturePiano/phuturePiano.html?name=meantoneB&matrix=[[1,0],[2,-1],[4,-4],[7,-10],[-2,13]]&octDist=6.656787385714829&tilt0=0&latticeMaxTanTilt=1&tau2=13/31&tau1=1&tau2ButtonRats=[5/12,18/43,31/74,13/31,34/81,21/50,8/19]
// http://mathheadinclouds.com/phuturePiano/tuningsList.html
// http://127.0.0.1/web/audio/
// http://127.0.0.1/web/bSplineSound/TheSoundOfBSplines.html
// http://127.0.0.1/web/demos/demos2/Figure5.11.html
// http://127.0.0.1/web/phunu/
// http://127.0.0.1/web/phupi03/tunings.html
// http://127.0.0.1/web/phuturePiano/phuturePiano.html?name=meantoneB&matrix=[[1,0],[2,-1],[4,-4],[7,-10],[-2,13]]&octDist=6.656787385714829&tilt0=0&latticeMaxTanTilt=1&tau2=0.42010083985030383&tau1=1.0011171089431532&tau2ButtonRats=[5/12,18/43,31/74,13/31,34/81,21/50,8/19]
// http://127.0.0.1/web/fractalSound4/fractalSound.html
// https://stackoverflow.com/questions/38282611/html-5-audiocontext-audiobuffer
// http://127.0.0.1/web/(/genkey/html/frequencyMorpher2.html
// http://127.0.0.1/web/(/genkey/html/oscillator.html
// http://127.0.0.1/web/(/genkeyold/phuturePiano.html?name=meantoneB&matrix=[[1,0],[2,-1],[4,-4],[7,-10],[-2,13]]&octDist=6.656787385714829&tilt0=0&latticeMaxTanTilt=1&tau2=0.42010083985030383&tau1=1.0011171089431532&tau2ButtonRats=[5/12,18/43,31/74,13/31,34/81,21/50,8/19]

// https://ctpt.co/
// https://github.com/teropa
// https://stackoverflow.com/questions/34919405/svgpathdata-chrome-48
// https://www.arc.id.au/CangoUserGuide.html
// https://hackernoon.com/creative-coding-using-the-microphone-to-make-sound-reactive-art-part1-164fd3d972f3
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
// https://webaudiodemos.appspot.com/pitchdetect/index.html
// sound file converter: https://cloudconvert.com/wma-to-aiff
// Tero Parviainen: https://teropa.info/
// https://github.com/VolodymyrTymets/sound-in-js/tree/master/client/src/components/Example4
// https://webdesigntips.blog/web-design/javascript/how-to-work-with-sound-in-javascript-create-a-custom-audio-player-with-react-and-web-audio-api/


// https://github.com/cwilso/volume-meter
// https://github.com/cwilso
// https://ourcodeworld.com/articles/read/413/how-to-create-a-volume-meter-measure-the-sound-level-in-the-browser-with-javascript
// fft at the bottom of the page: https://k6.io/blog/webaudio_explained


function bodyOnload(){
	var nbsp = Unicode.nbsp;
	var sliderStep = 1/1000;
	function calcFreq(exponent){
		return Math.round(100*Math.pow(2, exponent));
	}
	function calcExpo(freq){
		var result = Math.log(freq/100)/Math.LN2;
		return Math.round(result*1000)/1000;
	}
	App = fiat.dom.fiat([{
		variables: {
			logFreq      : {label: 'frequency', trafo: calcFreq, min: 0, max:   3, value: calcExpo(305) },
		},
		Slider: function(input,table,tbody,tr,td,th,div,span,$lib){
			var variables = $lib.variables;
			function setValue(varName, value){
				var nodes = $lib.instance.nodes;
				var VAR = variables[varName];
				var SLI = nodes.slider[varName];
				if (VAR.max < value){
					VAR.max = value;
					SLI.input.max = value;
					SLI.max.textContent = value;
				}
				if (VAR.min > value){
					VAR.min = value;
					SLI.input.min = value;
					SLI.min.textContent = value;
				}
				VAR.value = value;
				SLI.input.value = value;
				SLI.value.textContent = value;
			}
			function make(varName){
				var variable = variables[varName];
				var min = variable.min, max = variable.max, value = variable.value;
				return input.K(['slider', varName, 'input'])
					.C('slider')
					.a('type')('range').a('min')(min).a('max')(max).a('step')(sliderStep).p('value')(value)
					.E('input', 'Slider.sliderChange');
			}
			function makeRow(varName){
				var variable = variables[varName];
				var min = variable.min, max = variable.max, value = variable.value;
				var label = variable.label || varName;
				var transform = variable.trafo || function(x){return x;};
				variable.realValue = transform(value);
				return tr.K(['slider', varName, 'row']).C('slider-row')(
					th(label).K(['slider', varName, 'label']).C('label'),
					td(make(varName)),
					td.K(['slider', varName, 'min'])(transform(min)).C('number'),
					td(nbsp+Unicode.lessEqual+nbsp),
					td.K(['slider', varName, 'value'])(transform(value)).C('number'),
					td(nbsp+Unicode.lessEqual+nbsp),
					td.K(['slider', varName, 'max'])(transform(max)).C('number')
				);
			}
			function sliderChange(evt, elt, lib, key, ancestorData){
				var valueTD = fiat.util.drill(this.nodes, key.slice(0,2)).value;
				var rawValue = +elt.value;
				var varName = key[1];
				var VAR = variables[varName];
				var transform = VAR.trafo || function(x){return x;};
				var value = transform(rawValue);				
				valueTD.textContent = value;
				VAR.realValue = value;
				onFrequencyChange();
			}
			var freqKeys     = Object.keys(variables).filter(function(key){return  variables[key].trafo});
			var durationKeys = Object.keys(variables).filter(function(key){return !variables[key].trafo});
			var sliderTable = table.C('slider-table').K(['sliderTable', 'all'])(
				tbody.K(['sliderTable', 'first']).C('yellow')(
					durationKeys.map(makeRow)
				),
				tbody.K(['sliderTable', 'second']).C('blue')(
					freqKeys.map(makeRow)
				)
			);
			return {
				sliderTable  : sliderTable,
				sliderChange : sliderChange
			};
		},
		Audio: function(table,tr,td,th,div,span,button,input,br,$lib){
			function getFreq(){
				var vars = $lib.variables;
				return vars.logFreq.realValue;
			}
			var main = div(
				$lib.Slider.sliderTable
			);
			return {
				main        : main,
				getFreq     : getFreq
			};
		}
	}]).Audio.main.setRoot().fn.append(document.body);
}

function onFrequencyChange(){
	if (sine){
		sine.osc.frequency.value = App.library.Audio.getFreq();
	} else {
		sine = new Sine();
	}
}

function Sine(){
	var context  = new window.AudioContext();
	var freq     = App.library.Audio.getFreq();
	this.context = context;
	this.osc     = context.createOscillator();
	this.osc.frequency.value = freq;
	this.osc.connect(context.destination);
	this.osc.type = 'triangle'; // sawtooth square sine
	this.osc.start();
	//var THIS = this; window.requestAnimationFrame(function(){ THIS.update(); });
}

