import * as Tone from 'tone';

// Create a new synth and export it
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

export default synth;