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
	var myDuration = Math.round(1000/Math.PI)/1000;
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
			function buttonClick(evt, elt, lib, key, ancestorData){
				var vars = lib.variables;
				var duration1 = vars.duration1.realValue;
				var duration2 = vars.duration2.realValue;
				var duration3 = vars.duration3.realValue;
				var duration4 = vars.duration4.realValue;
				var freq1     = vars.logFreq1.realValue;
				var freq2     = vars.logFreq2.realValue;
				var freq3     = vars.logFreq3.realValue;
				var freq4     = vars.logFreq4.realValue;
				var loop      = this.nodes.loop.checked;
				var suppressClick = this.nodes.suppressClick.checked;
				var delay = vars.delay.realValue;
				var array = [
					{duration: duration1, freq: freq1},
					{duration: duration2, freq: freq2},
					{duration: duration3, freq: freq3},
					{duration: duration4, freq: freq4}
				];
				_audioTest(array, loop, delay, suppressClick);
			}
			var main = div(
				div.K(['info'])(nbsp),
				$lib.Slider.sliderTable,
				'loop' + nbsp, input.A({type: 'checkbox'}).K(['loop']),
				nbsp.repeat(2) + 'suppress click' + nbsp, input.A({type: 'checkbox'}).K(['suppressClick']).p('checked')(true),
				br,
				button('play').E('click', 'Audio.buttonClick')
			);
			return {
				main        : main,
				buttonClick : buttonClick
			};
		}
	}]).Audio.main.setRoot().fn.append(document.body);
}
function _audioTest(array, loop, delay, suppressClick){
	if (suppressClick){
		audioTest(array, loop, delay);
	} else {
		audioTest_withClickNoise(array, loop, delay);
	}
}
function audioTest(array, loop, delay){
	var context    = new window.AudioContext();
	var sampleRate = context.sampleRate;
	function createAndFillMonoBuffer(durationSeconds, freq, index, buffers, adjustedDurations){
		var numCycles        = Math.round(durationSeconds * freq);
		var samplesPerCycle  = sampleRate/freq;
		var bufSize          = numCycles * samplesPerCycle;
		var adjustedDuration = bufSize / sampleRate;
		var buffer           = context.createBuffer(1, bufSize, sampleRate);
		var channel0         = buffer.getChannelData(0);
		var factor           = 2*Math.PI/samplesPerCycle;
		for (var i=0; i<bufSize; i++){
		    channel0[i] = Math.sin(i*factor);
		}
		buffers[index] = buffer;
		adjustedDurations[index] = adjustedDuration;
	}
	var buffers = [];
	var sources = [];
	var adjustedDurations = [];
	for (var i=0; i<array.length; i++){
		createAndFillMonoBuffer(array[i].duration, array[i].freq, i, buffers, adjustedDurations);
	}
	if (loop){
		var runLoop = new RunLoop(context, buffers, adjustedDurations);
		runLoop.schedule();
	} else {
		var time = delay;
		for (var j=0; j<array.length; j++){
			var source = context.createBufferSource();
			sources[j] = source;
			source.buffer = buffers[j];
			source.connect(context.destination);
			source.start(time);
			time += adjustedDurations[j];
		}
	}
}

function InfiniteCycler(size){
	this.size = size;
	this.current = -1;
}
InfiniteCycler.prototype.next = function(){
    ++this.current;
    if (this.current>=this.size){
    	this.current -= this.size;
    }
    return this.current;
}

function RunLoop(context, buffers, durations){
	var size       = buffers.length;
	this.context   = context;
	this.buffers   = buffers;
	this.durations = durations;
	this.cycler    = new InfiniteCycler(size);
	this.time      = context.currentTime;
	this.sourceCount = 0;
}
RunLoop.prototype.createSource = function(idx){
	var context   = this.context,
		buffers   = this.buffers,
		durations = this.durations,
		size      = buffers.length,
		startTime = this.time;
	++this.sourceCount;
	var source = context.createBufferSource();
	source.connect(context.destination);
	source.buffer = buffers[idx];
	this.time = startTime + durations[idx];
	var THIS = this;
	source.addEventListener('ended', function(evt){
		//console.log('ended', idx, Math.round(evt.timeStamp*1000)/1000);
		--THIS.sourceCount;
		THIS.schedule();
	});
	source.start(startTime);
	App.nodes.info.textContent = this.sourceCount;
};
RunLoop.prototype.schedule = function(){
	function T(x){ return Math.round(1000*x)/1000; }
	var context = this.context, cycler = this.cycler;
	var now = context.currentTime;
	while (this.time - now <= 0.5){
		var bufferIdx = cycler.next();
		this.createSource(bufferIdx);
		//console.log(T(now), T(this.time), bufferIdx);
	}
};

function audioTest_withClickNoise(array, loop, delay){
	var context    = new window.AudioContext();
	var sampleRate = context.sampleRate;
	function createAndFillMonoBuffer(durationSeconds, freq){
		var bufSize         = durationSeconds * sampleRate;
		var samplesPerCycle = sampleRate/freq;
		var buffer          = context.createBuffer(1, bufSize, sampleRate);
		var channel0        = buffer.getChannelData(0);
		var factor          = 2*Math.PI/samplesPerCycle;
		for (var i=0; i<bufSize; i++){
		    channel0[i] = Math.sin(i*factor);
		}
		return buffer;
	}
	var buffers = [];
	var sources = [];
	for (var i=0; i<array.length; i++){
		buffers[i] = createAndFillMonoBuffer(array[i].duration, array[i].freq);
	}
	if (loop){

	} else {
		var time = delay;
		for (var j=0; j<array.length; j++){
			var source = context.createBufferSource();
			sources[j] = source;
			source.buffer = buffers[j];
			source.connect(context.destination);
			source.start(time);
			time += array[j].duration;
		}
	}
}
