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
				'computeCount'+nbsp, span.K(['computeCount'])(nbsp), br,
				'hasEndedCount'+nbsp, span.K(['hasEndedCount'])(nbsp), br,
				'cancelCount'+nbsp, span.K(['cancelCount'])(nbsp), br,
				$lib.Slider.sliderTable
			);
			return {
				main        : main,
				getFreq     : getFreq
			};
		}
	}]).Audio.main.setRoot().fn.append(document.body);
}

function Sine(chunkSize, bufferCount){
	var context      = new window.AudioContext();
	this.chunkSize   = chunkSize;
	this.bufferCount = bufferCount;
	this.context     = context;
	this.sources     = [];
	this.data        = [];
	var startTime    = context.currentTime + 0.017;
	var startAngle   = 0;
	this.start(startTime, startAngle);
	this.minComputeCount  =  Infinity;
	this.maxComputeCount  = -Infinity;
	this.minHasEndedCount =  Infinity;
	this.maxHasEndedCount = -Infinity;
	this.minCancelCount   =  Infinity;
	this.maxCancelCount   = -Infinity;
	var THIS = this; window.requestAnimationFrame(function(){ THIS.update(); });
}
Sine.prototype.start = function(startTime, startAngle){
	var context     = this.context;
	var bufferCount = this.bufferCount;
	var chunkSize   = this.chunkSize;
	for (var b=0; b<bufferCount; b++){
		var retObj = {};
		this.sources[b] = makeSource(context, startTime, startAngle, chunkSize, retObj);
		this.data[b] = {
			startTime  : startTime,
			endTime    : retObj.endTime,
			startAngle : startAngle,
			endAngle   : retObj.angle
		};
		startTime  = retObj.endTime;
		startAngle = retObj.angle;
	}
	this.bufferIdx   = 0;
};
function makeSource(context, startTime, startAngle, chunkSize, retObj){
	var sampleRate = context.sampleRate;
	var twoPi      = 2*Math.PI;
	var freq       = App.library.Audio.getFreq();
	var delta      = twoPi * freq / sampleRate;
	var buffer     = context.createBuffer(1, chunkSize, sampleRate);
	var channel0   = buffer.getChannelData(0);
	var angle      = startAngle;
	for (var i=0; i<chunkSize; i++){
		channel0[i] = Math.sin(angle);
		angle += delta;
		if (angle>=twoPi){ angle -= twoPi; }
	}
	retObj.angle = angle;
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start(startTime);
	retObj.endTime = startTime + chunkSize/sampleRate;
	return source;
}
Sine.prototype.update = function(){
	var context     = this.context;
	var bufferCount = this.bufferCount;
	var bufferIdx   = this.bufferIdx;
	var chunkSize   = this.chunkSize;
	var now         = context.currentTime;
	var thisData    = this.data;
	var hasEndedCount = (function(){
		for (var _b=0; _b<bufferCount; _b++){
			var b    = (bufferIdx + _b) % bufferCount;
			var data = thisData[b];
			var end  = data.endTime;
			if (now < end) return _b;
		}
		return bufferCount;
	})();
	if (hasEndedCount >= bufferCount){
		console.log('restart!');
		this.start(now, 0);
	} else {
		var newBufferIdx = (bufferIdx + hasEndedCount) % bufferCount;
		var cancelStart = (function(){
			for (var _b=bufferCount-1; _b>=0; _b--){
				var b     = (bufferIdx + _b) % bufferCount;
				var data  = thisData[b];
				var start = data.startTime;
				if (start < now + 0.03) return _b+1;
			}
			return 0;
		})();
		var computeCount = 0;
		var startTime, startAngle;
		for (var _b=cancelStart; _b<bufferCount + hasEndedCount; _b++){
			var b = (bufferIdx + _b) % bufferCount;
			this.sources[b].stop();
			var firstIteration = (computeCount === 0);
			++computeCount;
			if (firstIteration){
				startTime  = thisData[b].startTime;
				startAngle = thisData[b].startAngle;
			}
			var retObj = {};
			this.sources[b] = makeSource(context, startTime, startAngle, chunkSize, retObj);
			this.data[b] = {
				startTime  : startTime,
				endTime    : retObj.endTime,
				startAngle : startAngle,
				endAngle   : retObj.angle
			};
			startTime  = retObj.endTime;
			startAngle = retObj.angle;
		}
		var cancelCount = bufferCount - cancelStart;
		this.minComputeCount   = Math.min(this.minComputeCount , computeCount );
		this.maxComputeCount   = Math.max(this.maxComputeCount , computeCount );
		this.minHasEndedCount  = Math.min(this.minHasEndedCount, hasEndedCount);
		this.maxHasEndedCount  = Math.max(this.maxHasEndedCount, hasEndedCount);
		this.minCancelCount    = Math.min(this.minCancelCount  , cancelCount  );
		this.maxCancelCount    = Math.max(this.maxCancelCount  , cancelCount  );
		var info = [computeCount, hasEndedCount, cancelCount, newBufferIdx].join(', ');
		App.nodes.info.textContent = info;
		//console.log(info);
		App.nodes.computeCount.textContent  = [this.minComputeCount , this.maxComputeCount ].join(' | ');
		App.nodes.hasEndedCount.textContent = [this.minHasEndedCount, this.maxHasEndedCount].join(' | ');
		App.nodes.cancelCount.textContent   = [this.minCancelCount  , this.maxCancelCount  ].join(' | ');
		App.nodes.info2.textContent = cancelCount + (+App.nodes.info2.textContent);
		this.bufferIdx = newBufferIdx;
	}
	var THIS = this; window.requestAnimationFrame(function(){ THIS.update(); });
};
function onFrequencyChange(){
	if (!sine){ sine = new Sine(50, 64); }
}
