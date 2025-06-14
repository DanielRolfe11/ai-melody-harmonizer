'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to ensure the component is not server-side rendered
const PianoComponent = dynamic(() => import('../components/Piano'), {
  ssr: false,
  loading: () => <p className="text-center text-gray-400">Loading Piano...</p>,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <h1 className="text-4xl font-bold mb-8 text-white">AI Melody Harmonizer</h1>
      <PianoComponent />
    </main>
  );
}
