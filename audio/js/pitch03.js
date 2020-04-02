// original from:
// https://webaudiodemos.appspot.com/pitchdetect/index.html
// audio demos: http://webaudiodemos.appspot.com/
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext        = null;
var isPlaying           = false;
var sourceNode          = null;
var analyser            = null;
var theBuffer           = null;
var reconstructedBuffer = null;
var DEBUGCANVAS         = null;
var mediaStreamSource   = null;
var soundRequest        = null;
var isLiveInput         = undefined;
var loopCounter         = -1;
var canvasCount         = 80;
var canvCtxs            = [];
var canvasIdxSpan       = [];
var FFT_SIZE            = 2048;
var CANVAS_HEIGHT       = 256;
var detectorElem,canvasElem,waveCanvas,pitchElem,noteElem,detuneElem,detuneAmount,
	playBackButton,liveInputButton,oscillatorButton,canvasesParent;

var soundFile = "../sounds/la.mp3";

function bodyOnload(){
	soundRequest = new XMLHttpRequest();
	soundRequest.open("GET", soundFile, true);
	soundRequest.responseType = "arraybuffer";
	//soundRequest.onload = function(evt) {}
	soundRequest.send();
	detectorElem = document.getElementById( "detector" );
	canvasElem = document.getElementById( "output" );
	DEBUGCANVAS = document.getElementById( "waveform" );
	if (DEBUGCANVAS) {
		waveCanvas = DEBUGCANVAS.getContext("2d");
		waveCanvas.strokeStyle = "black";
		waveCanvas.lineWidth = 1;
	}
	pitchElem = document.getElementById( "pitch" );
	noteElem = document.getElementById( "note" );
	detuneElem = document.getElementById( "detune" );
	detuneAmount = document.getElementById( "detune_amt" );
	canvasesParent = document.getElementById("canvasesParent");
	/*for (var i=0; i<canvasCount; i++){
		var elt = document.createElement('canvas');
		elt.setAttribute('width', FFT_SIZE/2);
		elt.setAttribute('height', CANVAS_HEIGHT/3);
		elt.classList.add('correlation');
		elt.classList.add('displayNone');
		var txt = document.createElement('div'); txt.textContent=i; txt.classList.add('displayNone');
		canvasesParent.appendChild(txt);
		canvasesParent.appendChild(elt);
		canvCtxs[i] = elt.getContext('2d');
		canvasIdxSpan[i] = txt;
	}*/
}
function initAudioContext(callback) {
	audioContext = new AudioContext();
	audioContext.decodeAudioData(soundRequest.response, function(buffer){
		theBuffer = buffer;
		callback();
	});
}
function playBackButtonPressed(elt, evt){
	playBackButton = elt;
	if (audioContext){
		togglePlayback();
	} else {
		initAudioContext(togglePlayback);
	}
}
function liveInputButtonPressed(elt, evt){
	liveInputButton = elt;
	if (audioContext){
		toggleLiveInput();
	} else {
		initAudioContext(toggleLiveInput);
	}
}
function oscillatorButtonPressed(elt, evt){
	oscillatorButton = elt;
	if (audioContext){
		toggleOscillator();
	} else {
		initAudioContext(toggleOscillator);
	}
}

function error() { alert('Stream generation failed.'); }

function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
    	console.log(e);
    }
}
function createAnalyser(){
    analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
}
function gotStream(stream) {
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    createAnalyser();
    mediaStreamSource.connect( analyser );
    updatePitch();
}
function stopPlaying(){
	loopCounter = -1;
    sourceNode.stop( 0 );
    sourceNode = null;
    analyser = null;
    isPlaying = false;
    window.cancelAnimationFrame( rafID );
}
function startWithSourceNode(){
    sourceNode.connect( analyser );
    analyser.connect( audioContext.destination );
    sourceNode.start(0);
    isPlaying = true;
    isLiveInput = false;
    sourceNode.addEventListener('ended', function(evt){
	    sourceNode = null;
	    analyser = null;
	    isPlaying = false;
	    window.cancelAnimationFrame( rafID );
	    loopCounter = -1;
	    console.log(evt);
    });
    updatePitch();
}
function toggleOscillator() {
    if (isPlaying) {
    	stopPlaying();
        oscillatorButton.textContent = "play oscillator";
    } else {
	    sourceNode = audioContext.createOscillator();
	    createAnalyser();
	    startWithSourceNode();
        oscillatorButton.textContent = "stop";
    }
}
function togglePlayback() {
    if (isPlaying) {
    	stopPlaying();
        playBackButton.textContent = "start";
    } else {
	    sourceNode = audioContext.createBufferSource();
	    sourceNode.buffer = theBuffer;
	    //sourceNode.loop = true;
	    createAnalyser();
	    startWithSourceNode();
        playBackButton.textContent = "stop";
    }
}
function toggleLiveInput() {
    if (isPlaying) {
    	stopPlaying();
    }
    isLiveInput = true;
    getUserMedia(
    	{
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream);
}
var rafID = null;
var buflen = FFT_SIZE;
var buffers = [];
var timesSeconds = [];
var timesSamples = [];
var leadingWaste = 0;
for (var i=0; i<canvasCount; i++){
	buffers[i] = new Float32Array(buflen);
}

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch( frequency ) {
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

function centsOffFromPitch( frequency, note ) {
	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}

function detectPitch( buf, sampleRate ) {
	var SIZE = buf.length;
	var baseFreq = 32;
	var octaves = 5;
	for (var p=0; p<31*octaves; p++){
		var freq = baseFreq * Math.pow(2, p/31);
		var factor = 2*Math.PI*freq/sampleRate;
		var sinSum = 0;
		var cosSum = 0;
		var _sinSum = 0;
		var _cosSum = 0;
		for (var s=0; s<SIZE; s++){
			var signal = buf[s];
			var waveSin = Math.sin(factor*s);
			var waveCos = Math.cos(factor*s);
			var _waveSin = Math.sign(waveSin);
			var _waveCos = Math.sign(waveCos);
			sinSum += ( signal*waveSin );
			cosSum += ( signal*waveCos );
			_sinSum += ( signal*_waveSin );
			_cosSum += ( signal*_waveCos );
		}
		var sinCoe = _sinSum;
		var cosCoe = _cosSum;
		var magnitude = Math.sqrt(sinCoe*sinCoe + cosCoe*cosCoe);
		if (magnitude*Math.pow(0.7,p/31)>=35){
			console.log(p, round1000th(sampleRate/freq), round1000th(freq), round1000th(magnitude));
		}
	}
}
function round1000th(x){
	return Math.round(1000*x)/1000;
}
function isZero(buf){
	var size = buf.length;
	for (var i=0; i<size; i++){
		if (buf[i]!==0) return false;
	}
	return true;
}
function compareBuffers(previous, current){
	var minValue = Infinity;
	var bestOffset = NaN;
	for (var offset=0; offset<2000; offset++){
		var sum = 0;
		var L = FFT_SIZE - offset;
		for (var i=0; i<L; i++){
			var diff = current[i] - previous[i+offset];
			var sq = diff*diff;
			sum += sq;
		}
		var value = sum/L;
		if (value===0) return offset;
		if (value < minValue){
			minValue = value;
			bestOffset = offset;
		}
	}
	return NaN;
	//console.log(bestOffset, minValue);
}
function updatePitch( time ) {
	++loopCounter;
	var buf = buffers[loopCounter];
	analyser.getFloatTimeDomainData( buf );
	var now = audioContext.currentTime;
	timesSeconds[loopCounter] = now;
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
		var expectedEqual = FFT_SIZE - sampDiff;
		for (j=0; j<expectedEqual; j++){
			if (reconstructedBuffer[nowSamp + j] !== buf[j]){
				console.error('unexpected error', loopCounter, j);
				debugger;
			}
		}
		for (j=expectedEqual; j<FFT_SIZE; j++){
			reconstructedBuffer[nowSamp + j] = buf[j];
		}
		//console.log(loopCounter, nowSamp, sampDiff);
	}
	rafID = window.requestAnimationFrame( updatePitch );
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



function updatePitch____OLD( time ) {
	++loopCounter;
	var buf = buffers[loopCounter];
	analyser.getFloatTimeDomainData( buf );
	var now = audioContext.currentTime;
	timesSeconds[loopCounter] = now;
	var nowSamp = Math.round(audioContext.sampleRate * now);
	timesSamples[loopCounter] = nowSamp;
	var eqCounter = 0;
	var allEqual = true;
	for (var j=0; j<FFT_SIZE; j++){
		if (reconstructedBuffer[nowSamp + j] === buf[j]){
			if (allEqual){
				eqCounter++;
			}
		} else {
			reconstructedBuffer[nowSamp + j] = buf[j];
			allEqual = false;
		}
	}
	if (loopCounter>=1){
		var previous = buffers[loopCounter-1];
		var offset = compareBuffers(previous, buf);
		var sampDiff = timesSamples[loopCounter] - timesSamples[loopCounter-1];
		console.log([loopCounter, round1000th(now), sampDiff, offset, eqCounter, offset + eqCounter, sampDiff + eqCounter].join('    '));
		//detectPitch( buf, audioContext.sampleRate );		
	}
	rafID = window.requestAnimationFrame( updatePitch );
}
function zeroBetween(array, start, end){
    for (var i=start; i<end; i++){
        if (array[i]!==0) return false;
    }
    return true;
}
function countLeadingZeros(array){
	for (var i=0; i<array.length; i++){
		if (array[i]!==0) return i;
	}
	return array.length;
}
function makeArray(size){
	var result = [];
	for (var i=0; i<size; i++){
		result.push(i);
	}
	return result;
}
