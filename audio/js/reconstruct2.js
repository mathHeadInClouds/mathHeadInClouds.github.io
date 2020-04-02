// audio demos: http://webaudiodemos.appspot.com/
var soundFile         = "../sounds/la.mp4";
//var soundFile         = 'https://www.youtube.com/watch?v=Rlh5LDhS9ic&feature=youtu.be';
//var soundFile         = 'http://mathheadinclouds.com/audio/sounds/la.mp3';
var audioContext        = null;
var isPlaying           = false;
var sourceNode          = null;
var analyser            = null;
var theBuffer           = null;
var reconstructedBuffer = null;
var soundRequest        = null;
var loopCounter         = -1;
var FFT_SIZE            = 2048;
var rafID               = null;
var buffers             = [];
var timesSamples        = [];
var timeSampleDiffs     = [];
var leadingWaste        = 0;

window.addEventListener('load', function(){
	soundRequest = new XMLHttpRequest();
	soundRequest.open("GET", soundFile, true);
	soundRequest.responseType = "arraybuffer";
	//soundRequest.onload = function(evt) {}
	soundRequest.send();
	var btn = document.createElement('button');
	btn.textContent = 'go';
	btn.addEventListener('click', function(evt){goButtonClick(this,evt)});
	document.body.appendChild(btn);
});
function goButtonClick(elt,evt){
	initAudioContext(togglePlayback);
	elt.parentElement.removeChild(elt);
}
function initAudioContext(callback) {
	audioContext = new AudioContext();
	audioContext.decodeAudioData(soundRequest.response, function(buffer){
		theBuffer = buffer;
		callback();
	});
}
function createAnalyser(){
    analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
}
function startWithSourceNode(){
    sourceNode.connect( analyser );
    analyser.connect( audioContext.destination );
    sourceNode.start(0);
    isPlaying = true;
    sourceNode.addEventListener('ended', function(evt){
	    sourceNode = null;
	    analyser = null;
	    isPlaying = false;
	    loopCounter = -1;
	    window.cancelAnimationFrame( rafID );
	    console.log('buffer length', theBuffer.length);
	    console.log('reconstructedBuffer length', reconstructedBuffer.length);
	    console.log('audio callback called counter', buffers.length);
	    console.log('root mean square error', Math.sqrt( checkResult()/theBuffer.length ));
	    console.log('lengths of time between requestAnimationFrame callbacks, measured in audio samples:');
	    console.log(timeSampleDiffs);
	    console.log(
	    	timeSampleDiffs.filter(function(val){return val===384}).length,
	    	timeSampleDiffs.filter(function(val){return val===512}).length,
	    	timeSampleDiffs.filter(function(val){return val===640}).length,
	    	timeSampleDiffs.filter(function(val){return val===768}).length,
	    	timeSampleDiffs.filter(function(val){return val===896}).length,
	    	'*',
	    	timeSampleDiffs.filter(function(val){return val>896}).length,
	    	timeSampleDiffs.filter(function(val){return val<384}).length
	    );
	    console.log(
	    	timeSampleDiffs.filter(function(val){return val===384}).length +
	    	timeSampleDiffs.filter(function(val){return val===512}).length +
	    	timeSampleDiffs.filter(function(val){return val===640}).length +
	    	timeSampleDiffs.filter(function(val){return val===768}).length +
	    	timeSampleDiffs.filter(function(val){return val===896}).length
	    )
    });
    myAudioCallback2();
}
function togglePlayback() {
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = theBuffer;
    createAnalyser();
    startWithSourceNode();
}
function myAudioCallback2( time ) {
	++loopCounter;
	if (!buffers[loopCounter]){
		buffers[loopCounter] = new Float32Array(FFT_SIZE);
	}
	var buf = buffers[loopCounter];
	analyser.getFloatTimeDomainData( buf );
	var now = audioContext.currentTime;
	var nowSamp = Math.round(audioContext.sampleRate * now);
	timesSamples[loopCounter] = nowSamp;
	var j, sampDiff;
	if (loopCounter===0){
		console.log('start sample: ', nowSamp);
		reconstructedBuffer = new Float32Array(theBuffer.length + FFT_SIZE + nowSamp);
		leadingWaste = nowSamp;
		for (j=0; j<FFT_SIZE; j++){
			reconstructedBuffer[nowSamp + j] = buf[j];
		}
	} else {
		sampDiff = nowSamp - timesSamples[loopCounter-1];
		timeSampleDiffs.push(sampDiff);
		var expectedEqual = FFT_SIZE - sampDiff;
		var abomination = 0;
		while (reconstructedBuffer[nowSamp] !== buf[0]){
			++nowSamp;
			++abomination;
			timesSamples[loopCounter] = nowSamp;
		}
		if (abomination){
			console.log('abomination', loopCounter, abomination);
			sampDiff = nowSamp - timesSamples[loopCounter-1];
			timeSampleDiffs.push(sampDiff);
			expectedEqual = FFT_SIZE - sampDiff;
		}
		for (j=0; j<expectedEqual; j++){
			if (reconstructedBuffer[nowSamp + j] !== buf[j]){
				console.error('unexpected error', loopCounter, j);
				// debugger;
			}
		}
		for (j=expectedEqual; j<FFT_SIZE; j++){
			reconstructedBuffer[nowSamp + j] = buf[j];
		}
		//console.log(loopCounter, nowSamp, sampDiff);
	}
	rafID = window.requestAnimationFrame( myAudioCallback2 );
}
function myAudioCallback( time ) {
	++loopCounter;
	if (!buffers[loopCounter]){
		buffers[loopCounter] = new Float32Array(FFT_SIZE);
	}
	var buf = buffers[loopCounter];
	analyser.getFloatTimeDomainData( buf );
	var now = audioContext.currentTime;
	var nowSamp = Math.round(audioContext.sampleRate * now);
	timesSamples[loopCounter] = nowSamp;
	var j, sampDiff;
	if (loopCounter===0){
		console.log('start sample: ', nowSamp);
		reconstructedBuffer = new Float32Array(theBuffer.length + FFT_SIZE + nowSamp);
		leadingWaste = nowSamp;
		for (j=0; j<FFT_SIZE; j++){
			reconstructedBuffer[nowSamp + j] = buf[j];
		}
	} else {
		sampDiff = nowSamp - timesSamples[loopCounter-1];
		timeSampleDiffs.push(sampDiff);
		var expectedEqual = FFT_SIZE - sampDiff;
		for (j=0; j<expectedEqual; j++){
			if (reconstructedBuffer[nowSamp + j] !== buf[j]){
				console.error('unexpected error', loopCounter, j);
				// debugger;
			}
		}
		for (j=expectedEqual; j<FFT_SIZE; j++){
			reconstructedBuffer[nowSamp + j] = buf[j];
		}
		//console.log(loopCounter, nowSamp, sampDiff);
	}
	rafID = window.requestAnimationFrame( myAudioCallback );
}
function checkResult(){
	var ch0 = theBuffer.getChannelData(0);
	var ch1 = theBuffer.getChannelData(1);
	var sum = 0;
	var idxDelta = leadingWaste + FFT_SIZE;
	for (var i=0; i<theBuffer.length; i++){
		var samp0 = ch0[i];
		var samp1 = ch1[i];
		var samp = (samp0+samp1)/2;
		var check = reconstructedBuffer[i+idxDelta];
		var diff = samp - check;
		var sqDiff = diff*diff;
		sum += sqDiff;
	}
	return sum;
}
