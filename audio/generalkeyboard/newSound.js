var soundObj = null;
var microphoneObj = null;
var rafID = -1;

function soundMouseButtonClick(elt, evt){
	var soundMouseBtn   = document.getElementById('soundMouseBtn');
	var soundMicBtn     = document.getElementById('soundMicBtn');
	var soundSilenceBtn = document.getElementById('soundSilenceBtn');
	elt.style.backgroundColor = 'rgb(128,255,128)';
	soundMicBtn.style.backgroundColor = '';
	soundSilenceBtn.style.backgroundColor = '';
	if (!soundObj){
		soundObj = new SoundObj();
	}
}
function soundMicButtonClick(elt, evt){
	var soundMouseBtn   = document.getElementById('soundMouseBtn');
	var soundMicBtn     = document.getElementById('soundMicBtn');
	var soundSilenceBtn = document.getElementById('soundSilenceBtn');
	elt.style.backgroundColor = 'rgb(128,255,128)';
	soundMouseBtn.style.backgroundColor = '';
	soundSilenceBtn.style.backgroundColor = '';
	if (soundObj){
		soundObj.oscillator.stop();
		soundObj = null;
	}
	if (!microphoneObj){
		microphoneObj = new MicrophoneObj();
	}
}
function soundSilenceButtonClick(elt, evt){
	var soundMouseBtn   = document.getElementById('soundMouseBtn');
	var soundMicBtn     = document.getElementById('soundMicBtn');
	var soundSilenceBtn = document.getElementById('soundSilenceBtn');
	elt.style.backgroundColor = 'rgb(128,255,128)';
	soundMouseBtn.style.backgroundColor = '';
	soundMicBtn.style.backgroundColor = '';
	if (soundObj){
		soundObj.oscillator.stop();
		soundObj = null;
	}
	if (microphoneObj){
		document.getElementById('microphoneHzLabel').textContent = ' ';
		window.cancelAnimationFrame(microphoneObj.rafID);
		microphoneObj = null;
	}
}
function soundButtonClick(elt, evt){
	var _playing = 1 - elt.dataset.playing;
	elt.dataset.playing = _playing;
	var playing = !!_playing;
	elt.textContent = playing ? 'Sound off' : 'Sound on';
	if (playing){
		if (!soundObj){
			soundObj = new SoundObj();
		}
	} else {
		if (soundObj){
			soundObj.oscillator.stop();
			soundObj = null;
		}
	}
}
function getCurrentFrequency(){
	var mouseIntCoords = Keyboard.mouseIntCoordsFromMouseGraphicsCoords(mouse.x, mouse.y);
	var pitch = Keyboard.getPitchAtVec(mouseIntCoords);
	var frequency = Math.pow(2, pitch) * 216;
	return frequency;
}
function SoundObj(){
	this.context    = new window.AudioContext();
	this.oscillator = this.context.createOscillator();
	this.oscillator.frequency.value = getCurrentFrequency();
	this.oscillator.connect(this.context.destination);
	this.oscillator.type = 'triangle'; // sawtooth square sine
	this.oscillator.start();
}
function MicrophoneObj(){
	function onError(){
		debugger;
	}
	var context = this.context = new window.AudioContext();
	var analyser = this.analyser = context.createAnalyser();
	analyser.fftSize = 2048;
	var microphoneStream = null;
	var THIS = this;
    navigator.getUserMedia({
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
            },
            "optional": []
        },
    }, function(stream){
	    microphoneStream = context.createMediaStreamSource(stream);
	    microphoneStream.connect(analyser);
	    THIS.updatePitch();
    }, onError);
}
MicrophoneObj.prototype.updatePitch = function(time){
	var analyser = this.analyser;
	var context  = this.context;
	var fftSize  = analyser.fftSize;
	var buffer   = new Float32Array(fftSize);
	analyser.getFloatTimeDomainData(buffer);
	var freqHz = autoCorrelate(buffer, context.sampleRate);
	if (freqHz===-1){
		document.getElementById('microphoneHzLabel').textContent = 'low volume';
	} else {
		var pitch = Math.log(freqHz/108)/Math.LN2;
		var sungKeys = Keyboard.intGrid.filter(function(coords){
			return Math.abs(Keyboard.getPitchAtVec(coords) - pitch) < 0.45/31;
		});
		document.getElementById('microphoneHzLabel').textContent = Math.round(100*freqHz)/100 + 'Hz ' + sungKeys.length;
		Keyboard.sungKeys = sungKeys;
		Keyboard.clearAndDraw();
	}
	var THIS = this;
	this.rafID = window.requestAnimationFrame(function(_time){
		THIS.updatePitch(_time);
	});
};

function autoCorrelate( buf, sampleRate ) {
	var SIZE       = buf.length;
	var max_offset = Math.floor(SIZE*0.5);
	var rms        = 0;
	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) return -1; // not enough signal

	var offsets   = [];
	var indices   = [];
	var accuDiffs = [];
	var levels    = [];
	var offset    = 40;
	var index     = 0;
	var subNotePartition = 3;
	var factor    = Math.pow(2, (1/subNotePartition)/31);
	while (true){
		if (offset>=max_offset) break;
		offsets.push(offset);
		accuDiffs.push(0);
		offset *= factor;
		indices.push(index);
		++index;
		levels.push(0);
	}
	function bufferAt(idx){
		var lo = Math.floor(idx);
		var hi = lo + 1;
		var hiFactor = idx - lo;
		var loFactor = 1 - hiFactor;
		return loFactor*buf[lo] + hiFactor*buf[hi];
	}
	var bucketIdx;
	var maxLevel = 0;
	var newIndices;
	var previousSize = -1;
	var bucketFactor = 1;
	var tobeCancelled;
	while (true){
		++maxLevel;
		var currentSize = indices.length;
		if (currentSize <= 16) {
			tobeCancelled = {};
			indices.forEach(function(index){
				tobeCancelled[index + subNotePartition*31] = null;
				tobeCancelled[index + subNotePartition*49] = null;
				tobeCancelled[index + subNotePartition*62] = null;
				tobeCancelled[index + subNotePartition*72] = null;
				tobeCancelled[index + subNotePartition*80] = null;
				tobeCancelled[index + subNotePartition*87] = null;
				tobeCancelled[index + subNotePartition*93] = null;
			});
			indices = indices.filter(function(index){
				return !(index in tobeCancelled);
			});
			if (Math.max.apply(null, indices)-Math.min.apply(null, indices)<=5) break;
		}
		if (currentSize === previousSize) { bucketFactor *= 2; }
		if (maxLevel>=999){ debugger; break; }
		var buckets = [];
		for (var ii=0; ii<indices.length; ii++){
			index = indices[ii];
			offset = offsets[index];
			++levels[index];
			var maxI = SIZE - offset - 1.00001;
			var sumTemp = 0;
			for (var z=0; z<10; z++){
				var i = Math.random() * maxI;
				var j = i + offset;
				var diff = Math.abs(bufferAt(i) - bufferAt(j));
				sumTemp += diff;
			}
			accuDiffs[index] += sumTemp;
			var accuDiff = accuDiffs[index];
			bucketIdx = Math.floor(bucketFactor * accuDiff/rms);
			if (!buckets[bucketIdx]){ buckets[bucketIdx] = []; }
			buckets[bucketIdx].push(index);
		}
		bucketIdx = -1;
		var nextSize = 0;
		var innerWhileLoopCount = 0;
		var lowestAccuDiff = Infinity;
		var highestAccuDiff = -Infinity;
		var primeBucketsDone = (currentSize>=100);
		var lastPrimeBucketIdx = -1;
		var primeIndices = [];
		while (true){
			++innerWhileLoopCount;
			if (innerWhileLoopCount>=99999){
				debugger; break;
			}
			++bucketIdx;
			if (buckets[bucketIdx]){
				if (primeBucketsDone){
					nextSize += buckets[bucketIdx].length;
				} else {
					for (var d=0; d<buckets[bucketIdx].length; d++){
						var val = accuDiffs[buckets[bucketIdx][d]];
						lowestAccuDiff  = Math.min(lowestAccuDiff , val);
						highestAccuDiff = Math.max(highestAccuDiff, val);
					}
					nextSize += buckets[bucketIdx].length;
					if ( (nextSize>=5) || (highestAccuDiff/lowestAccuDiff>=1.2) ){
						primeBucketsDone = true;
						lastPrimeBucketIdx = bucketIdx;
					}
					primeIndices = primeIndices.concat(buckets[bucketIdx]);
				}
				if (nextSize >= indices.length) break;
				if (currentSize >= 20){
					if (nextSize >= 0.9*currentSize) break;
				} else {
					if (nextSize >= currentSize-1) break;
				}
			}
		}
		var limitAccuDiff = rms*(bucketIdx+1)/bucketFactor;
		tobeCancelled = {};
		if (lastPrimeBucketIdx >= 0){
			primeIndices.forEach(function(index){
				tobeCancelled[index + subNotePartition*31] = null;
				tobeCancelled[index + subNotePartition*49] = null;
				tobeCancelled[index + subNotePartition*62] = null;
				tobeCancelled[index + subNotePartition*72] = null;
				tobeCancelled[index + subNotePartition*80] = null;
				tobeCancelled[index + subNotePartition*87] = null;
				tobeCancelled[index + subNotePartition*93] = null;
			});
		}
		indices = indices.filter(function(index){
			return ( (accuDiffs[index] < limitAccuDiff) && (!(index in tobeCancelled)) );
		});
		previousSize = currentSize;
	}
	var result_idx;
	if (indices.length===1){
		result_idx = indices[0];
	} else {
		if (indices.length===2){
			result_idx = (indices[0]+indices[1])/2;
		} else {
			data4QR = indices.map(function(index){
				return {
					x: index,
					y: accuDiffs[index]
				};
			});
			var qr = quadraticRegression(data4QR);
			result_idx = -qr.b/(2*qr.a);
		}
	}
	function calcOffset(idx){ return 40*Math.pow(2, (idx/subNotePartition)/31); }
	var result_offset = calcOffset(result_idx);
	var result_freq = sampleRate/result_offset;
	return result_freq/2;
}
function det33(mat){
    return mat[0][0] * ( mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1] )
         + mat[0][1] * ( mat[1][2] * mat[2][0] - mat[1][0] * mat[2][2] )
         + mat[0][2] * ( mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0] );
}
function quadraticRegression(data){
	var N = data.length;
	var s0 = 0;
	var s1 = 0;
	var s2 = 0;
	var s3 = 0;
	var s4 = 0;
	var r0 = 0;
	var r1 = 0;
	var r2 = 0;
	for (var i=0; i<N; i++){
		var x  = data[i].x;
		var y  = data[i].y;
		var x2 = x*x;
		var x3 = x2*x;
		var x4 = x2*x2;
		s0 += 1;
		s1 += x;
		s2 += x2;
		s3 += x3;
		s4 += x4;
		r0 += y;
		r1 += (x*y);
		r2 += (x2*y);
	}
	var deter = det33([[s4,s3,s2],[s3,s2,s1],[s2,s1,s0]]);
	var a     = det33([[r2,s3,s2],[r1,s2,s1],[r0,s1,s0]])/deter;
	var b     = det33([[s4,r2,s2],[s3,r1,s1],[s2,r0,s0]])/deter;
	var c     = det33([[s4,s3,r2],[s3,s2,r1],[s2,s1,r0]])/deter;
	return {a:a, b:b, c:c};
}

