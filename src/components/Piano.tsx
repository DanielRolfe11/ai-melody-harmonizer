'use client'; // This directive is crucial for client-side components in Next.js

import { useEffect, useState } from 'react';
import type { PolySynth, Synth } from 'tone';

// A simple piano key component
const PianoKey = ({ note, playNote }: { note: string; playNote: (note: string) => void }) => {
  return (
    <button
      className="p-4 border border-gray-800 bg-white text-black rounded-md hover:bg-gray-200 active:bg-gray-400"
      onMouseDown={() => playNote(note)}
    >
      {note}
    </button>
  );
};

export default function Piano() {
  const [synth, setSynth] = useState<PolySynth<Synth> | null>(null);

  useEffect(() => {
    // Dynamically import the synth to ensure it's only loaded on the client-side
    import('../lib/synth').then(module => {
      setSynth(module.default);
    });
  }, []);

  const playNote = (note: string) => {
    if (synth) {
      synth.triggerAttackRelease(note, '8n');
    }
  };

  return (
    <div className="flex space-x-2 p-4 bg-gray-900 rounded-lg">
      <PianoKey note="C4" playNote={playNote} />
      <PianoKey note="D4" playNote={playNote} />
      <PianoKey note="E4" playNote={playNote} />
      <PianoKey note="F4" playNote={playNote} />
      <PianoKey note="G4" playNote={playNote} />
    </div>
  );
}