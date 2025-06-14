'use client';

import { useEffect, useState } from 'react';
import type { PolySynth, Synth } from 'tone';

// 1. DEFINE THE PIANO LAYOUT, NOTES, AND KEYBOARD MAPPINGS
// We create a more detailed data structure for our piano keys.
// `type` determines styling, and `key` maps to your computer keyboard.
const pianoKeys = [
  { note: 'C4', key: 'a', type: 'white' },
  { note: 'C#4', key: 'w', type: 'black' },
  { note: 'D4', key: 's', type: 'white' },
  { note: 'D#4', key: 'e', type: 'black' },
  { note: 'E4', key: 'd', type: 'white' },
  { note: 'F4', key: 'f', type: 'white' },
  { note: 'F#4', key: 't', type: 'black' },
  { note: 'G4', key: 'g', type: 'white' },
  { note: 'G#4', key: 'y', type: 'black' },
  { note: 'A4', key: 'h', type: 'white' },
  { note: 'A#4', key: 'u', type: 'black' },
  { note: 'B4', key: 'j', type: 'white' },
  { note: 'C5', key: 'k', type: 'white' },
];

export default function Piano() {
  const [synth, setSynth] = useState<PolySynth<Synth> | null>(null);
  // 2. STATE TO TRACK PRESSED KEYS
  // This prevents the "machine gun" effect when a key is held down.
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    import('../lib/synth').then(module => {
      setSynth(module.default);
    });
  }, []);

  const playNote = (note: string) => {
    if (synth) {
      synth.triggerAttackRelease(note, '8n');
    }
  };

  // 3. KEYBOARD EVENT HANDLING LOGIC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if the key is already held down
      if (activeKeys.has(event.key)) return;

      const keyData = pianoKeys.find(k => k.key === event.key);
      if (keyData) {
        playNote(keyData.note);
        // Add the key to the active set
        setActiveKeys(prev => new Set(prev).add(event.key));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Remove the key from the active set on key release
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [synth, activeKeys]); // Rerun effect if synth or activeKeys changes

  return (
    // 4. STYLED PIANO CONTAINER
    // `relative` is crucial for positioning the black keys correctly.
    <div className="relative flex h-48">
      {pianoKeys.map(key => {
        const isWhite = key.type === 'white';
        const isActive = activeKeys.has(key.key);

        return (
          <button
            key={key.note}
            onMouseDown={() => playNote(key.note)}
            className={`
              ${isWhite ? 'w-12 h-48 border-2 border-black bg-white' : 'w-8 h-32 absolute z-10 bg-black border-2 border-black'}
              ${isActive ? (isWhite ? 'bg-gray-300' : 'bg-gray-700') : ''}
              ${isWhite ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}
            `}
            // 5. POSITIONING BLACK KEYS
            // We use inline styles for positioning since it's unique to each black key.
            style={isWhite ? {} : {
              left: {
                'C#4': '2rem',
                'D#4': '4.75rem',
                'F#4': '10.25rem',
                'G#4': '13rem',
                'A#4': '15.75rem',
              }[key.note],
            }}
          >
          </button>
        );
      })}
    </div>
  );
}