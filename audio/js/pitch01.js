// original from:
// https://webaudiodemos.appspot.com/pitchdetect/index.html
// audio demos: http://webaudiodemos.appspot.com/
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext      = null;
var isPlaying         = false;
var sourceNode        = null;
var analyser          = null;
var theBuffer         = null;
var DEBUGCANVAS       = null;
var mediaStreamSource = null;
var soundRequest      = null;
var isLiveInput       = undefined;
var loopCounter       = -1;
var canvasCount       = 80;
var canvCtxs          = [];
var canvasIdxSpan     = [];
var FFT_SIZE          = 2048;
var CANVAS_HEIGHT     = 256;
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
	for (var i=0; i<canvasCount; i++){
		var elt = document.createElement('canvas');
		elt.setAttribute('width', FFT_SIZE/2);
		elt.setAttribute('height', CANVAS_HEIGHT);
		elt.classList.add('correlation');
		elt.classList.add('displayNone');
		var txt = document.createElement('span'); txt.textContent=i; txt.classList.add('displayNone');
		canvasesParent.appendChild(txt);
		canvasesParent.appendChild(document.createElement('br'));
		canvasesParent.appendChild(elt);
		canvasesParent.appendChild(document.createElement('br'));
		canvCtxs[i] = elt.getContext('2d');
		canvasIdxSpan[i] = txt;
	}
}

function initAudioContext(callback) {
	audioContext = new AudioContext();
	// MAX_SIZE = Math.max(4,Math.floor(audioContext.sampleRate/5000));	// corresponds to a 5kHz signal
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
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect it to the destination.
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
var tracks = null;
var buflen = FFT_SIZE;
var buf = new Float32Array( buflen );

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

function autoCorrelate( buf, sampleRate ) {
	var SIZE             = buf.length;
	var MAX_SAMPLES      = Math.floor(SIZE/2);
	var best_offset      = -1;
	var best_correlation = -Infinity;
	var rms              = 0;
	var correlations     = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) return -1; // not enough signal

	var canvCtx = canvCtxs[loopCounter];
	var spanElt = canvasIdxSpan[loopCounter];
	canvCtx.canvas.classList.remove('displayNone');
	spanElt.classList.remove('displayNone');
	canvCtx.clearRect(0,0,MAX_SAMPLES,CANVAS_HEIGHT);
	canvCtx.strokeStyle = 'black';
	canvCtx.lineWidth = 1;
	canvCtx.beginPath();
	for (var offset = 15; offset < MAX_SAMPLES; offset++) {
		var _correlation = 0;
		for (var i=0; i<MAX_SAMPLES; i++) {
			_correlation += Math.abs((buf[i])-(buf[i+offset]));
		}
		var correlation = 1 - _correlation/MAX_SAMPLES;
		correlations[offset] = correlation;
		if (correlation > best_correlation) {
			best_correlation = correlation;
			best_offset      = offset;
		}
		var y = Math.max(0, CANVAS_HEIGHT*(1-correlation));
		if (offset===0){
			canvCtx.moveTo(offset, y);
		} else {
			canvCtx.lineTo(offset, y);
		}
	}
	canvCtx.stroke();
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	canvCtx.canvas.classList.add('displayNone');
	spanElt.classList.add('displayNone');
	return -1;
}

function updatePitch( time ) {
	++loopCounter;
	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, audioContext.sampleRate );
	console.log(loopCounter, ac);

 	if (ac == -1) {
 		detectorElem.className = "vague";
	 	pitchElem.innerText = "--";
		noteElem.innerText = "-";
		detuneElem.className = "";
		detuneAmount.innerText = "--";
 	} else {
	 	detectorElem.className = "confident";
	 	pitch = ac;
	 	pitchElem.innerText = Math.round( pitch ) ;
	 	var note =  noteFromPitch( pitch );
		noteElem.innerHTML = noteStrings[note%12];
		var detune = centsOffFromPitch( pitch, note );
		if (detune == 0 ) {
			detuneElem.className = "";
			detuneAmount.innerHTML = "--";
		} else {
			if (detune < 0)
				detuneElem.className = "flat";
			else
				detuneElem.className = "sharp";
			detuneAmount.innerHTML = Math.abs( detune );
		}
	}

	rafID = window.requestAnimationFrame( updatePitch );
}
