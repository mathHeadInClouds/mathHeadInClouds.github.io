"use strict";
var App, sine = null;
// https://www.karajanmusictech.com/
// https://www.karajanmusictech.com/speaker/
// https://t.me/joinchat/C08wpldQFk11B2v4imUr-w?mc_cid=65f8cec4fd&mc_eid=
// http://themindshift.tv/ entrepreneur's kitchen
// https://stackoverflow.com/questions/34708980/generate-sine-wave-and-play-it-in-the-browser
// https://stackoverflow.com/questions/37459231/webaudio-seamlessly-playing-sequence-of-audio-chunks
// https://stackoverflow.com/questions/29086039/does-calling-stop-on-a-source-node-trigger-an-ended-event
// https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
// https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode/onended

function bodyOnload(){
	var nbsp = Unicode.nbsp;
	var sliderStep = 1/1000;
	function calcFreq(exponent){
		return Math.round(100*Math.pow(2, exponent));
	}
	App = fiat.dom.fiat([{
		variables: {
			logFreq      : {label: 'frequency', trafo: calcFreq, min: 0, max:   3, value: 1},
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
				span.K(['info'])(nbsp), nbsp.repeat(5), span.K(['info2'])(0), br,
				$lib.Slider.sliderTable
			);
			return {
				main        : main,
				getFreq     : getFreq
			};
		}
	}]).Audio.main.setRoot().fn.append(document.body);
}

function Sine(bufferSize, chunkSize){
	var context     = new window.AudioContext();
	this.bufferSize = bufferSize;
	this.chunkSize  = chunkSize;
	this.context    = context;
	this.angle      = 0;
	this.time       = context.currentTime + 0.015;
	this.running    = false;
	var THIS = this; window.requestAnimationFrame(function(){ THIS.update(); });
}
Sine.prototype.update = function(){
	var context    = this.context;
	var now        = context.currentTime;
	var sampleRate = context.sampleRate;
	var diff       = Math.round(sampleRate * (this.time-now));
	if (diff <= this.bufferSize) {
		var startTime = (diff>=0) ? this.time : now;
		if (diff<0){
			App.nodes.info2.textContent = 1 + (+App.nodes.info2.textContent);
		}
		App.nodes.info.textContent = diff;
		var twoPi      = 2*Math.PI;
		var freq       = App.library.Audio.getFreq();
		var delta      = twoPi * freq / sampleRate;
		var chunkSize  = this.chunkSize;
		var buffer     = context.createBuffer(1, chunkSize, sampleRate);
		var channel0   = buffer.getChannelData(0);
		var angle      = this.angle;
		for (var i=0; i<chunkSize; i++){
			channel0[i] = Math.sin(angle);
			angle += delta;
			if (angle>=twoPi){ angle -= twoPi; }
		}
		this.angle = angle;
		var source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(context.destination);
		source.start(startTime);
		this.time = startTime + chunkSize/sampleRate;
	}
	var THIS = this; window.requestAnimationFrame(function(){ THIS.update(); });
};
function onFrequencyChange(){
	if (!sine){ sine = new Sine(1470, 740); }
}
