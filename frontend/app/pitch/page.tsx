'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, Network, Lock, Zap, CheckCircle2 } from 'lucide-react';

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Image src="/logo.png" alt="Shizen Gate" width={120} height={60} priority />
          <Link href="/home">
            <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold">
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6 px-4 py-2 bg-cyan-400/20 border border-cyan-400/30 rounded-full">
                <span className="text-cyan-400 font-semibold">Wormhole × DefiLlama Hackathon</span>
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Shizen Gate
              </h1>
              <p className="text-2xl text-zinc-400 mb-8">
                Cross-Chain FHE Lending Protocol
              </p>
              <p className="text-lg text-zinc-500 mb-8">
                Private, secure, and seamless DeFi lending powered by Fully Homomorphic Encryption, Wormhole cross-chain messaging, and DefiLlama analytics.
              </p>
              <Link href="/home">
                <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-lg px-8 py-6">
                  Try It Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">FHE Privacy</h3>
                      <p className="text-sm text-zinc-400">Fully encrypted balances</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                      <Network className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Wormhole Bridge</h3>
                      <p className="text-sm text-zinc-400">Seamless cross-chain</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">DefiLlama Data</h3>
                      <p className="text-sm text-zinc-400">Real-time analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">The Problem</h2>
              <div className="space-y-4 text-lg text-zinc-400">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>DeFi lending protocols lack privacy - all balances are publicly visible on-chain</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Cross-chain yield opportunities are fragmented and difficult to access</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Users lack proper analytics to make informed decisions</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Complex UX makes DeFi inaccessible to many users</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Solution</h2>
              <div className="space-y-4 text-lg text-zinc-400">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                  <p><strong className="text-cyan-400">FHE encryption</strong> keeps your balances completely private</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                  <p><strong className="text-cyan-400">Wormhole</strong> enables seamless cross-chain deposits in 2-5 minutes</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                  <p><strong className="text-cyan-400">DefiLlama</strong> provides real-time TVL and yield analytics</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                  <p><strong className="text-cyan-400">Simple UX</strong> makes DeFi accessible to everyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-cyan-400">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Deposit USDC</h3>
                  <p className="text-zinc-400">User deposits USDC on Base Sepolia through our intuitive interface with a single click.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Network className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Cross-Chain Bridge</h3>
                  <p className="text-zinc-400">Wormhole automatically relays the message from Base Sepolia to Sepolia in 2-5 minutes.</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">FHE Encryption</h3>
                  <p className="text-zinc-400">FHE-encrypted receipt tokens are minted on Sepolia. Your balance is completely private.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Earn Yield</h3>
                  <p className="text-zinc-400">Your USDC earns yield on Aave with complete privacy and security. Track it with DefiLlama data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Powered By</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-cyan-400/20 rounded-xl flex items-center justify-center">
                  <Network className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold">Wormhole</h3>
              </div>
              <ul className="space-y-3 text-zinc-400">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Cross-chain message passing between Base Sepolia and Sepolia</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Automatic relayer for seamless user experience</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Reliable delivery with 2x fee buffer for guaranteed execution</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-cyan-400/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold">DefiLlama</h3>
              </div>
              <ul className="space-y-3 text-zinc-400">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Real-time Aave Protocol TVL and yield data integration</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Top yield pools and APY tracking for informed decisions</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Chain TVL rankings and comprehensive analytics dashboard</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 bg-gradient-to-b from-black to-cyan-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Experience Private DeFi?
          </h2>
          <p className="text-xl text-zinc-400 mb-12">
            Start earning yield with complete privacy today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/home">
              <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-xl px-12 py-8">
                Launch Shizen Gate
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-8">
        <div className="max-w-7xl mx-auto text-center text-zinc-500">
          <p>Built for Wormhole × DefiLlama Hackathon 2024</p>
        </div>
      </footer>
    </div>
  );
}
