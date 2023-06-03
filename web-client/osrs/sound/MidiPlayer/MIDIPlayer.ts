import { getSamplesFromSoundFont, SynthEvent } from "@ryohey/wavelet";
import { AnyEvent, EndOfTrackEvent, MIDIControlEvents, MidiFile, read} from "midifile-ts";
import { EventScheduler } from "./EventScheduler";
import { ProcessorLoader } from './processor/ProcessorLoader';

interface Tick {
    tick: number
    track: number
}

type LoadMidiEvent = {
    type: "loadMidi";
    events: AnyEvent[];
    tick: number;
    timebase: number;
    lookAheadTime: number;
    endOfSong: number;
};

type MidiActionEvent = {
    type: "midiAction";
    action: "resume"|"pause"|"stop";
};

type SynthEventExtended = SynthEvent | LoadMidiEvent | MidiActionEvent;



function addTick(events: AnyEvent[], track: number): (AnyEvent & Tick)[] {
    let tick = 0
    return events.map((e) => {
        tick += e.deltaTime
        return {
            ...e,
            tick,
            track
        }
    })
}

export const isEndOfTrackEvent = (e: AnyEvent): e is EndOfTrackEvent =>
    "subtype" in e && e.subtype === "endOfTrack"

const TIMER_INTERVAL = 100
const LOOK_AHEAD_TIME = 50

export class MIDIPlayer {
    private context: AudioContext;
    private synth: AudioWorkletNode;

    private output: (e: SynthEventExtended, transfer?: Transferable[]) => void;
    private midi: MidiFile;
    private sampleRate: number;
    private tickedEvents: (AnyEvent & Tick)[];
    private scheduler: EventScheduler < AnyEvent & Tick >;
    private endOfSong: number;
    public onProgress ? : (progress: number) => void;

    constructor() {
        this.setup();

        document.addEventListener("click", () => {this.context.resume();});
        document.addEventListener("touchstart", () => {this.context.resume();});
    }

    private async setup() {
        // Create audio context
        this.context = new AudioContext();
        this.sampleRate = this.context.sampleRate;

        // Load audio worklet processor
        try {
            await this.context.audioWorklet.addModule(await ProcessorLoader.Load())
        } catch (e) {
            console.error(e);
            throw Error("Failed to add AudioWorklet module");
        }

        // Create output synthesizer
        this.synth = new AudioWorkletNode(this.context, "synth-processor", {
            numberOfInputs: 0,
            outputChannelCount: [2],
        })
        this.synth.connect(this.context.destination);
        this.output = (e: SynthEventExtended, transfer?: Transferable[]) => {
            this.synth.port.postMessage(e, transfer ?? [])
        }
    }
    
    public loadSoundFont(soundFontBuffer: ArrayBuffer) {
        const parsed = getSamplesFromSoundFont(new Uint8Array(soundFontBuffer), this.context);
        
        for (const sample of parsed) {
            this.output(sample, [sample.sample.buffer]);
        }
    }

    public loadMidi(midiBuffer: ArrayBuffer) {
        const midi = read(midiBuffer);
        this.midi = midi;
        this.tickedEvents = midi.tracks.flatMap(addTick).sort((a, b) => a.tick - b.tick);
        this.scheduler = new EventScheduler(this.tickedEvents, 0, this.midi.header.ticksPerBeat, TIMER_INTERVAL + LOOK_AHEAD_TIME);
        this.endOfSong = Math.max(...this.tickedEvents.filter(isEndOfTrackEvent).map((e) => e.tick));
        this.resetControllers();
        
        this.output({
            type: "loadMidi",
            events: this.tickedEvents,
            tick: 0,
            timebase: this.midi.header.ticksPerBeat,
            lookAheadTime: TIMER_INTERVAL + LOOK_AHEAD_TIME,
            endOfSong: this.endOfSong
        });
    }

    public resume() {
        this.output({
            type: "midiAction",
            action: 'resume',
        });
        // if (this.interval === undefined) {
        //     this.interval = window.setInterval(() => this.onTimer(), TIMER_INTERVAL)
        // }
    }

    public pause() {
        this.output({
            type: "midiAction",
            action: 'pause',
        });
        // clearInterval(this.interval)
        // this.interval = undefined
        this.allSoundsOff()
    }

    public stop() {
        // this.output({
        //     type: "midiAction",
        //     action: 'stop',
        // });
        this.pause()
        this.resetControllers()
        this.scheduler.seek(0)
        // this.onProgress?.(0)
    }

    // 0: start, 1: end
    public seek(position: number) {
        this.allSoundsOff()
        this.scheduler.seek(position * this.endOfSong)
    }

    public setVolume(volume: number) {
        for (let i = 0; i < 16; i++) {
            this.output({
                type: "midi",
                midi: {
                    type: "channel",
                    subtype: "controller",
                    controllerType: MIDIControlEvents.MSB_MAIN_VOLUME,
                    channel: i,
                    value: volume,
                },
                delayTime: 0,
            })
        }
    }

    private allSoundsOff() {
        for (let i = 0; i < 16; i++) {
            this.output({
                type: "midi",
                midi: {
                    type: "channel",
                    subtype: "controller",
                    controllerType: MIDIControlEvents.ALL_SOUNDS_OFF,
                    channel: i,
                    value: 0,
                },
                delayTime: 0,
            })
        }
    }

    private resetControllers() {
        for (let i = 0; i < 16; i++) {
            this.output({
                type: "midi",
                midi: {
                    type: "channel",
                    subtype: "controller",
                    controllerType: MIDIControlEvents.RESET_CONTROLLERS,
                    channel: i,
                    value: 0,
                },
                delayTime: 0,
            })
        }
    }
}