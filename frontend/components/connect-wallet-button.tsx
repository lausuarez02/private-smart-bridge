'use client';

import dynamic from 'next/dynamic';

const ConnectButtonDynamic = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  { ssr: false }
);

export function ConnectWalletButton() {
  return <ConnectButtonDynamic />;
}
