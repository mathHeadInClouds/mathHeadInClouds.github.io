// sound.js
Sound = {
    isSetup: false,
    isRunning: false,
    tail: null,
    currentWritePosition: 0,
    sampleRate: 30000,
    numChannels: 1, // mono
    bufferLengthInSeconds: 0.2,
    currentSoundValue: 0,
    audio: null,
    volume: 0.2,
    baseFreq: 220,
    freq: 1,
    setup: function(){
        // Initialize the audio output.
        this.audio = new Audio();
        this.audio.mozSetup(this.numChannels, this.sampleRate);
        this.prebufferSize = this.sampleRate * this.bufferLengthInSeconds;
        this.readWave = this.sawTooth;
    },
    sawTooth: function(soundData) {
        for (var i=0, size=soundData.length; i<size; i++) {
            var delta = 2 * this.volume * this.baseFreq * this.freq / this.sampleRate;
            this.currentSoundValue += delta;
            if (this.currentSoundValue >= this.volume) this.currentSoundValue = -this.volume;
            soundData[i] = this.currentSoundValue;
        }        
    },
    loop: function() {
        var written;
        // Check if some data was not written in previous attempts.
        if(this.tail) {  
            written = this.audio.mozWriteAudio(tail);
            this.currentWritePosition += written;
            if(written < tail.length) {
                // Not all the data was written, saving the tail...
                tail = tail.slice(written);
                return; // ... and exit the function.
            }
            tail = null;
        }
        // Check if we need add some data to the audio output.
        var currentPosition = this.audio.mozCurrentSampleOffset();
        var available = currentPosition + this.prebufferSize - this.currentWritePosition;
        if(available > 0) {
            // Request some sound data from the callback function.
            var soundData = new Float32Array(available);
            this.readWave(soundData);
            // Writting the data.
            written = this.audio.mozWriteAudio(soundData);
            if(written < soundData.length) {
            // Not all the data was written, saving the tail.
            tail = soundData.slice(written);
            }
            this.currentWritePosition += written;
        }
    },
    start: function(){
        if (!this.isSetup){
            this.setup();
            this.isSetup = true;
        }
        this.isRunning = true;
        this.callBack = setInterval(function(){Sound.loop()}, 15);
    },
    stop: function(){
        this.isRunning = false;
        clearTimeout(this.callBack);
    }
};
