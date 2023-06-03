import { Buffer } from "../net/Buffer";
import { SoundTrackInstrument } from "./SoundTrackInstrument";

function PCMPlayer(option) {
    this.init(option);
}

PCMPlayer.prototype.init = function(option) {
    var defaults = {
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000
    };
    this.option = Object.assign({}, defaults, option);
    this.samples = new Float32Array();
    this.flush = this.flush.bind(this);
    this.interval = setInterval(this.flush, this.option.flushingTime);
    this.maxValue = this.getMaxValue();
    this.typedArray = this.getTypedArray();
    this.createContext();
};

PCMPlayer.prototype.getMaxValue = function () {
    var encodings = {
        '8bitInt': 128,
        '16bitInt': 32768,
        '32bitInt': 2147483648,
        '32bitFloat': 1,
        '8bitUint': 255,
    }

    return encodings[this.option.encoding] ? encodings[this.option.encoding] : encodings['16bitInt'];
};

PCMPlayer.prototype.getTypedArray = function () {
    var typedArrays = {
        '8bitInt': Int8Array,
        '16bitInt': Int16Array,
        '32bitInt': Int32Array,
        '32bitFloat': Float32Array,
        '8bitUint': Uint8Array,
    }

    return typedArrays[this.option.encoding] ? typedArrays[this.option.encoding] : typedArrays['16bitInt'];
};

PCMPlayer.prototype.createContext = function() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // context needs to be resumed on iOS and Safari (or it will stay in "suspended" state)
    this.audioCtx.resume();
    this.audioCtx.onstatechange = () => console.log(this.audioCtx.state);   // if you want to see "Running" state in console and be happy about it
    
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 1;
    this.gainNode.connect(this.audioCtx.destination);
    this.startTime = this.audioCtx.currentTime;
};

PCMPlayer.prototype.isTypedArray = function(data) {
    return (data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer);
};

PCMPlayer.prototype.feed = function(data) {
    if (!this.isTypedArray(data)) return;
    data = this.getFormatedValue(data);
    var tmp = new Float32Array(this.samples.length + data.length);
    tmp.set(this.samples, 0);
    tmp.set(data, this.samples.length);
    this.samples = tmp;
};

PCMPlayer.prototype.getFormatedValue = function(data) {
    var data = new this.typedArray(data.buffer),
        float32 = new Float32Array(data.length),
        i;

    for (i = 0; i < data.length; i++) {
        float32[i] = data[i] / this.maxValue;
    }
    return float32;
};

PCMPlayer.prototype.volume = function(volume) {
    this.gainNode.gain.value = volume;
};

PCMPlayer.prototype.destroy = function() {
    if (this.interval) {
        clearInterval(this.interval);
    }
    this.samples = null;
    this.audioCtx.close();
    this.audioCtx = null;
};

PCMPlayer.prototype.flush = function() {
    if (!this.samples.length) return;
    var bufferSource = this.audioCtx.createBufferSource(),
        length = this.samples.length / this.option.channels,
        audioBuffer = this.audioCtx.createBuffer(this.option.channels, length, this.option.sampleRate),
        audioData,
        channel,
        offset,
        i,
        decrement;

    for (channel = 0; channel < this.option.channels; channel++) {
        audioData = audioBuffer.getChannelData(channel);
        offset = channel;
        decrement = 50;
        for (i = 0; i < length; i++) {
            audioData[i] = this.samples[offset];
            /* fadein */
            if (i < 50) {
                audioData[i] =  (audioData[i] * i) / 50;
            }
            /* fadeout*/
            if (i >= (length - 51)) {
                audioData[i] =  (audioData[i] * decrement--) / 50;
            }
            offset += this.option.channels;
        }
    }
    
    if (this.startTime < this.audioCtx.currentTime) {
        this.startTime = this.audioCtx.currentTime;
    }
    console.log('start vs current '+this.startTime+' vs '+this.audioCtx.currentTime+' duration: '+audioBuffer.duration);
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(this.gainNode);
    bufferSource.start(this.startTime);
    this.startTime += audioBuffer.duration;
    this.samples = new Float32Array();
};

var player = new PCMPlayer({
    encoding: '8bitUint',
    channels: 1,
    sampleRate: 22050,
    flushingTime: 0
});

window.PCMPlayer = player;

export class SoundTrack {

    public static aByte664: number = 6;

    public static tracks: SoundTrack[] = Array(5000).fill(null);
    public static trackDelays: number[] = Array(5000).fill(0);
    public static _buffer: number[] = null;

    public static buffer: Buffer = null;
    
    public static load(buffer: Buffer) {
        window.SoundTrack = SoundTrack;

        const downloadBlob = function(data, fileName, mimeType) {
            var blob, url;
            blob = new Blob([data], {
              type: mimeType
            });
            url = window.URL.createObjectURL(blob);
            downloadURL(url, fileName);
            setTimeout(function() {
              return window.URL.revokeObjectURL(url);
            }, 1000);
          };
          
          const downloadURL = function(data, fileName) {
            var a;
            a = document.createElement('a');
            a.href = data;
            a.download = fileName;
            document.body.appendChild(a);
            a.style = 'display: none';
            a.click();
            a.remove();
        };

        SoundTrack._buffer = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(441000);
        SoundTrack.buffer = new Buffer(SoundTrack._buffer);
        SoundTrackInstrument.decode();
        while ((true)) {{
            const trackId: number = buffer.getUnsignedLEShort();
            if (trackId === 65535) { return; }
            SoundTrack.tracks[trackId] = new SoundTrack(-524);
            SoundTrack.tracks[trackId].decode(buffer);
            SoundTrack.trackDelays[trackId] = SoundTrack.tracks[trackId].delay();

            // console.log("trackId", trackId);
            // downloadBlob(new Uint8Array(encoded.buffer), 'sound.bin', 'application/octet-stream');
            // throw Error("sto");
        }}

        // setTimeout(() => {
        //     console.log("Playing sound");
        //     const trackId = 1278;
        //     console.log(trackId)
        //     const encoded = SoundTrack.data(trackId, 1);
        //     console.log("encoded", encoded)

        //     var player = new PCMPlayer({
        //         encoding: '8bitUint',
        //         channels: 1,
        //         sampleRate: 22050,
        //         flushingTime: 2000
        //     });
    
        //     player.feed(new Uint8Array(encoded.buffer));

        //     downloadBlob(new Uint8Array(encoded.buffer), 'sound.bin', 'application/octet-stream');
        // }, 10000);
    }

    public static play(trackId: number) {
        const encoded = SoundTrack.data(trackId, 1);
        console.log("encoded", encoded)

        player.feed(new Uint8Array(encoded.buffer));

        setTimeout(() => {
            console.log("flushing");
            player.flush();
        }, 1000);
    }

    public static data(trackId: number, loops: number): Buffer {
        if (SoundTrack.tracks[trackId] != null) {
            const soundTrack: SoundTrack = SoundTrack.tracks[trackId];
            return soundTrack.encode(loops);
        } else {
            return null;
        }
    }

    public instruments: SoundTrackInstrument[] = [null, null, null, null, null, null, null, null, null, null];

    public loopBegin: number;

    public loopEnd: number;

    public constructor(i: number) {
        if (this.loopBegin === undefined) { this.loopBegin = 0; }
        if (this.loopEnd === undefined) { this.loopEnd = 0; }
        while ((i >= 0)) {{
            throw Error("NullPointerException");
        }}
    }

    public decode(buffer: Buffer) {
        for (let instrument: number = 0; instrument < 10; instrument++) {{
            const active: number = buffer.getUnsignedByte();
            if (active !== 0) {
                buffer.currentPosition--;
                this.instruments[instrument] = new SoundTrackInstrument();
                this.instruments[instrument].decode(buffer);
            }
        }}
        this.loopBegin = buffer.getUnsignedLEShort();
        this.loopEnd = buffer.getUnsignedLEShort();
    }

    public delay(): number {
        let delay: number = 9999999;
        for (let instrument: number = 0; instrument < 10; instrument++) {if (this.instruments[instrument] != null && (this.instruments[instrument].pauseMillis / 20 | 0) < delay) { delay = (this.instruments[instrument].pauseMillis / 20 | 0); }}
        if (this.loopBegin < this.loopEnd && (this.loopBegin / 20 | 0) < delay) { delay = (this.loopBegin / 20 | 0); }
        if (delay === 9999999 || delay === 0) { return 0; }
        for (let instrument: number = 0; instrument < 10; instrument++) {if (this.instruments[instrument] != null) { this.instruments[instrument].pauseMillis -= delay * 20; }}
        if (this.loopBegin < this.loopEnd) {
            this.loopBegin -= delay * 20;
            this.loopEnd -= delay * 20;
        }
        return delay;
    }

    public encode(j: number): Buffer {
        const size: number = this.mix(j);
        SoundTrack.buffer.currentPosition = 0;
        SoundTrack.buffer.putInt(1380533830);
        SoundTrack.buffer.putLEInt(36 + size);
        SoundTrack.buffer.putInt(1463899717);
        SoundTrack.buffer.putInt(1718449184);
        SoundTrack.buffer.putLEInt(16);
        SoundTrack.buffer.putLEShort(1);
        SoundTrack.buffer.putLEShort(1);
        SoundTrack.buffer.putLEInt(22050);
        SoundTrack.buffer.putLEInt(22050);
        SoundTrack.buffer.putLEShort(1);
        SoundTrack.buffer.putLEShort(8);
        SoundTrack.buffer.putInt(1684108385);
        SoundTrack.buffer.putLEInt(size);
        SoundTrack.buffer.currentPosition += size;
        return SoundTrack.buffer;
    }

    public mix(loops: number): number {
        let millis: number = 0;
        for (let instrument: number = 0; instrument < 10; instrument++) {if (this.instruments[instrument] != null && this.instruments[instrument].soundMillis + this.instruments[instrument].pauseMillis > millis) { millis = this.instruments[instrument].soundMillis + this.instruments[instrument].pauseMillis; }}
        if (millis === 0) { return 0; }
        let nS: number = ((22050 * millis) / 1000 | 0);
        let loopBegin: number = ((22050 * this.loopBegin) / 1000 | 0);
        let loopEnd: number = ((22050 * this.loopEnd) / 1000 | 0);
        if (loopBegin < 0 || loopBegin > nS || loopEnd < 0 || loopEnd > nS || loopBegin >= loopEnd) { loops = 0; }
        let length: number = nS + (loopEnd - loopBegin) * (loops - 1);
        for (let position: number = 44; position < length + 44; position++) {SoundTrack._buffer[position] = -128; }
        for (let instrument: number = 0; instrument < 10; instrument++) {if (this.instruments[instrument] != null) {
            const soundSamples: number = ((this.instruments[instrument].soundMillis * 22050) / 1000 | 0);
            const pauseSamples: number = ((this.instruments[instrument].pauseMillis * 22050) / 1000 | 0);
            const samples: number[] = this.instruments[instrument].synthesize(soundSamples, this.instruments[instrument].soundMillis);
            for (let soundSample: number = 0; soundSample < soundSamples; soundSample++) {{
                let sample: number = (SoundTrack._buffer[soundSample + pauseSamples + 44] & 255) + (samples[soundSample] >> 8);
                if ((sample & -256) !== 0) { sample = ~(sample >> 31); }
                SoundTrack._buffer[soundSample + pauseSamples + 44] = ((sample as number) | 0);
            }}
        }}
        if (loops > 1) {
            loopBegin += 44;
            loopEnd += 44;
            nS += 44;
            let offset: number = (length += 44) - nS;
            for (let position: number = nS - 1; position >= loopEnd; position--) {SoundTrack._buffer[position + offset] = SoundTrack._buffer[position]; }
            for (let loopCounter: number = 1; loopCounter < loops; loopCounter++) {{
                offset = (loopEnd - loopBegin) * loopCounter;
                for (let position: number = loopBegin; position < loopEnd; position++) {SoundTrack._buffer[position + offset] = SoundTrack._buffer[position]; }
            }}
            length -= 44;
        }
        return length;
    }
}