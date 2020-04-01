"use strict";
var App;
// https://www.karajanmusictech.com/
// https://www.karajanmusictech.com/speaker/
// https://t.me/joinchat/C08wpldQFk11B2v4imUr-w?mc_cid=65f8cec4fd&mc_eid=
// http://themindshift.tv/ entrepreneur's kitchen
// https://stackoverflow.com/questions/34708980/generate-sine-wave-and-play-it-in-the-browser
// https://stackoverflow.com/questions/37459231/webaudio-seamlessly-playing-sequence-of-audio-chunks
// https://stackoverflow.com/questions/29086039/does-calling-stop-on-a-source-node-trigger-an-ended-event

function bodyOnload(){
	var nbsp = Unicode.nbsp;
	var sliderStep = 1/1000;
	function calcFreq(exponent){
		return Math.round(100*Math.pow(2, exponent));
	}
	var myDuration = 0.15;
	App = fiat.dom.fiat([{
		variables: {
			duration1     : {                                 min: 0, max:  10, value: myDuration},
			duration2     : {                                 min: 0, max:  10, value: myDuration},
			duration3     : {                                 min: 0, max:  10, value: myDuration},
			duration4     : {                                 min: 0, max:  10, value: myDuration},
			delay         : {                                 min: 0, max:   1, value: 0.02},
			logFreq1      : {label: 'freq1', trafo: calcFreq, min: 0, max:   3, value: 1},
			logFreq2      : {label: 'freq2', trafo: calcFreq, min: 0, max:   3, value: 1+Math.log(5/4)/Math.LN2},
			logFreq3      : {label: 'freq3', trafo: calcFreq, min: 0, max:   3, value: 1+Math.log(3/2)/Math.LN2},
			logFreq4      : {label: 'freq4', trafo: calcFreq, min: 0, max:   3, value: 1+Math.log(7/4)/Math.LN2}
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
		Audio: function(table,tr,td,th,div,button,input,br,$lib){
			function getData(){
				var vars = $lib.variables;
				var duration1 = vars.duration1.realValue;
				var duration2 = vars.duration2.realValue;
				var duration3 = vars.duration3.realValue;
				var duration4 = vars.duration4.realValue;
				var freq1     = vars.logFreq1.realValue;
				var freq2     = vars.logFreq2.realValue;
				var freq3     = vars.logFreq3.realValue;
				var freq4     = vars.logFreq4.realValue;
				return [
					{duration: duration1, freq: freq1},
					{duration: duration2, freq: freq2},
					{duration: duration3, freq: freq3},
					{duration: duration4, freq: freq4}
				];
			}
			function buttonClick(evt, elt, lib, key, ancestorData){
				var loop  = this.nodes.loop.checked;
				var delay = lib.variables.delay.realValue;
				audioTest(getData(), loop, delay);
			}
			var main = div(
				div.K(['info'])(nbsp),
				$lib.Slider.sliderTable,
				'loop' + nbsp, input.A({type: 'checkbox'}).K(['loop']).p('checked')(true),
				br,
				button('play').E('click', 'Audio.buttonClick')
			);
			return {
				main        : main,
				buttonClick : buttonClick,
				getData     : getData
			};
		}
	}]).Audio.main.setRoot().fn.append(document.body);
}
function createBuffer(context, duration, freq){
	var sampleRate       = context.sampleRate;
	var numCycles        = Math.round(duration * freq);
	var samplesPerCycle  = sampleRate/freq;
	var bufSize          = numCycles * samplesPerCycle;
	var adjustedDuration = bufSize / sampleRate;
	var buffer           = context.createBuffer(1, bufSize, sampleRate);
	var channel0         = buffer.getChannelData(0);
	var factor           = 2*Math.PI/samplesPerCycle;
	for (var i=0; i<bufSize; i++){
	    channel0[i] = Math.sin(i*factor);
	}
	return {
		buffer   : buffer,
		duration : adjustedDuration
	};
}
function audioTest(array, loop, delay){
	var context = new window.AudioContext();
	var size    = array.length;
	if (loop){
		var runLoop = new RunLoop(context, delay);
		runLoop.schedule();
	} else {
		var buffers           = [];
		var adjustedDurations = [];
		for (var i=0; i<size; i++){
			var b = createBuffer(context, array[i].duration, array[i].freq);
			buffers[i] = b.buffer;
			adjustedDurations[i] = b.duration;
		}
		var time = delay;
		for (var j=0; j<size; j++){
			var source = context.createBufferSource();
			source.buffer = buffers[j];
			source.connect(context.destination);
			source.start(time);
			time += adjustedDurations[j];
		}
	}
}

function RunLoop(context, delay){
	this.context = context;
	this.time    = context.currentTime + delay;
	this.idx     = -1;
}
RunLoop.prototype.schedule = function(){
	var context   = this.context,
		startTime = this.time,
		array     = App.library.Audio.getData(),
		size      = array.length,
		now       = context.currentTime,
		THIS      = this;
	while (startTime - now <= 1){
		++this.idx;
		if (this.idx>=size) { this.idx -= size; }
		var entry       = array[this.idx],
			duration    = entry.duration,
			freq        = entry.freq,
			budu        = createBuffer(context, duration, freq),
			buffer      = budu.buffer,
			adjDuration = budu.duration,
			source      = context.createBufferSource();
		source.buffer   = buffer;
		source.connect(context.destination);
		source.start(startTime);
		startTime += adjDuration;
		this.time = startTime;
		source.addEventListener('ended', function(evt){
			THIS.schedule();
		});
	}

};
