"use strict";
var App;
var audioContext = null;
var meter = null;
var canvasContext = null;
var rafID = null;
var mediaStreamSource = null;

function bodyOnload(){
	var nbsp = Unicode.nbsp;
	var canvasWidth = 500, canvasHeight = 50;
	App = fiat.dom.fiat([{
		Audio: function(table,tr,td,th,div,span,button,input,br,canvas,$lib){
			var main = div(
				div(button('show volume meter').E('click', 'Audio.buttonClick')),
				canvas.A({id: 'meter', width: canvasWidth, height: canvasHeight}).K(['theCanvas']),
				div.K(['bufLength'])(nbsp)
			);
			function buttonClick(evt, elt, lib, key, ancestorData){
				var parentDiv = elt.parentNode;
				parentDiv.parentNode.removeChild(parentDiv);
				initAudio();
			}
			return {
				main        : main,
				buttonClick : buttonClick 
			};
		}
	}]).Audio.main.setRoot().fn.append(document.body);
}
function initAudio() {
	canvasContext = document.getElementById( "meter" ).getContext("2d");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    try {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia(
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
        }, onMicrophoneGranted, onMicrophoneDenied);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}
function onMicrophoneDenied() { alert('Stream generation failed.'); }
function onMicrophoneGranted(stream) {
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    onLevelChange();
}
function onLevelChange( time ) {
	var canvas = canvasContext.canvas, WIDTH = canvas.width, HEIGHT = canvas.height;
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);
	canvasContext.fillStyle = meter.checkClipping() ? "red" : "green";
    canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);
    rafID = window.requestAnimationFrame( onLevelChange );
}
function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
    var processor = audioContext.createScriptProcessor(512);
    processor.onaudioprocess = volumeAudioProcess;
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel || 0.98;
    processor.averaging = averaging || 0.95;
    processor.clipLag = clipLag || 750;
    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    processor.connect(audioContext.destination);
    processor.checkClipping = function(){
        if (!this.clipping) return false;
        if ((this.lastClip + this.clipLag) < window.performance.now()) this.clipping = false;
        return this.clipping;
    };
    processor.shutdown = function(){
        this.disconnect();
        this.onaudioprocess = null;
    };
    return processor;
}
function volumeAudioProcess( event ) {
    var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
    // App.nodes.bufLength.textContent = bufLength; --> 512
    var sum = 0;
    var x;
    // Do a root-mean-square on the samples: sum up the squares...
    for (var i=0; i<bufLength; i++) {
        x = buf[i];
        if (Math.abs(x)>=this.clipLevel) {
            this.clipping = true;
            this.lastClip = window.performance.now();
        }
        sum += x * x;
    }
    // ... then take the square root of the sum.
    var rms =  Math.sqrt(sum / bufLength);
    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume*this.averaging);
}
