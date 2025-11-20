'use client';

import Image from 'next/image';

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Image src="/logo.png" alt="Shizen Gate" width={120} height={60} priority />
      </div>
    </div>
  );
}
