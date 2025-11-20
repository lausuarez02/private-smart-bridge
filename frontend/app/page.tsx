'use client';

import FaultyTerminal from '@/components/FaultyTerminal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, margin: 0, padding: 0 }}>
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        timeScale={1}
        pause={false}
        scanlineIntensity={1}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
        chromaticAberration={0}
        dither={0}
        curvature={0}
        tint="#ffffff"
        mouseReact={true}
        mouseStrength={0.5}
        pageLoadAnimation={false}
        brightness={1}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-16 z-10">
        <div className="relative">
          <Image
            src="/logo.png"
            alt="Shizen Gate"
            width={800}
            height={400}
            priority
            className="drop-shadow-2xl"
          />
        </div>

        <button
          onClick={() => router.push('/home')}
          className="enter-button group relative px-20 py-7 text-4xl font-bold tracking-widest overflow-hidden bg-white border-4 border-white"
        >
          <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">
            ENTER
          </span>
          <div className="absolute inset-0 bg-black transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          <div className="glitch-effect"></div>
        </button>
      </div>
    </div>
  );
}
