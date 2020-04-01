"use strict";
var App;
// https://www.karajanmusictech.com/
// https://www.karajanmusictech.com/speaker/
// https://t.me/joinchat/C08wpldQFk11B2v4imUr-w?mc_cid=65f8cec4fd&mc_eid=
// http://themindshift.tv/ entrepreneur's kitchen
// https://stackoverflow.com/questions/34708980/generate-sine-wave-and-play-it-in-the-browser

function bodyOnload(){
	var nbsp = Unicode.nbsp;
	var sliderStep = 1/1000;
	function calcFreq(exponent){
		return Math.round(100*Math.pow(2, exponent));
	}
	App = fiat.dom.fiat([{
		variables: {
			duration      : {                                 min: 0, max:  10, value: 3},
			durationOffset: {                                 min: 0, max:  10, value: 1},
			logFreq1      : {label: 'freq1', trafo: calcFreq, min: 0, max:   3, value: 2},
			logFreq2      : {label: 'freq2', trafo: calcFreq, min: 0, max:   3, value: Math.log(5)/Math.LN2}
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
				var durationSeconds = vars.duration.realValue;
				var durationOffsetSeconds = vars.durationOffset.realValue;
				var freq1 = vars.logFreq1.realValue;
				var freq2 = vars.logFreq2.realValue;
				var loop  = this.nodes.loop.checked;
				audioTest2(durationSeconds, durationOffsetSeconds, freq1, freq2, loop);
			}
			var main = div(
				$lib.Slider.sliderTable,
				'loop' + nbsp, input.A({type: 'checkbox'}).K(['loop']),br,
				button('play').E('click', 'Audio.buttonClick')
			);
			return {
				main        : main,
				buttonClick : buttonClick
			};
		}
	}]).Audio.main.setRoot().fn.append(document.body);
}
function audioTest1(durationSeconds, durationOffsetSeconds, freq1, freq2, loop){
	// durationSeconds=3, durationOffsetSeconds=1, freq1=400, freq2=500
	var context          = new window.AudioContext();
	var sampleRate       = context.sampleRate;
	var bufSize          = durationSeconds * sampleRate;
	var offsetSamples    = durationOffsetSeconds * sampleRate;
	var samplesPerCycle1 = sampleRate/freq1;
	var samplesPerCycle2 = sampleRate/freq2;
	var buf1             = new Float32Array(bufSize);
	var buf2             = new Float32Array(bufSize);
	var factor1          = 2*Math.PI/samplesPerCycle1;
	var factor2          = 2*Math.PI/samplesPerCycle2;
	for (var i=0; i<bufSize; i++){
	    buf1[i] = Math.sin(i*factor1);
	    buf2[i] = Math.sin(i*factor2);
	}
	var buffer = context.createBuffer(2, bufSize, sampleRate);
	buffer.copyToChannel(buf1, 0);
	buffer.copyToChannel(buf2, 1, offsetSamples);
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.loop = loop;
	source.connect(context.destination);
	source.start(0);
}
function audioTest2(durationSeconds, durationOffsetSeconds, freq1, freq2, loop){
	// durationSeconds=3, durationOffsetSeconds=1, freq1=400, freq2=500
	var context          = new window.AudioContext();
	var sampleRate       = context.sampleRate;
	var bufSize          = durationSeconds * sampleRate;
	var offsetSamples    = Math.round(durationOffsetSeconds * sampleRate);
	var samplesPerCycle1 = sampleRate/freq1;
	var samplesPerCycle2 = sampleRate/freq2;
	var buffer           = context.createBuffer(2, bufSize, sampleRate);
	var buf1             = buffer.getChannelData(0);
	var buf2             = buffer.getChannelData(1);
	var factor1          = 2*Math.PI/samplesPerCycle1;
	var factor2          = 2*Math.PI/samplesPerCycle2;
	for (var i=0; i<bufSize; i++){
	    buf1[i] = Math.sin(i*factor1);
	    var j = i + offsetSamples;
	    if (j<bufSize){
	    	buf2[j] = Math.sin(i*factor2);
	    }
	}
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.loop = loop;
	source.connect(context.destination);
	source.start(0);
}
