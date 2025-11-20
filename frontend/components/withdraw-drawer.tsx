'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWithdraw } from '@/hooks/useWithdraw';
import { useWormholeFee } from '@/hooks/useWormholeFee';
import { ExternalLink, Loader2, ArrowUpRight } from 'lucide-react';

export function WithdrawDrawer() {
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const { withdraw, loading, error, txHash } = useWithdraw();
  const { fee, loading: feeLoading } = useWormholeFee();

  async function handleWithdraw() {
    try {
      await withdraw(amount);
      // Don't close drawer immediately - show success message
    } catch (err) {
      console.error(err);
    }
  }

  function handleClose() {
    setOpen(false);
    setAmount('');
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Withdraw
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          {!txHash ? (
            <>
              <DrawerHeader>
                <DrawerTitle>Withdraw from Aave</DrawerTitle>
                <DrawerDescription>
                  Withdraw your USDC from Aave. Your FHE tokens will be burned on Sepolia and USDC will be returned to your wallet on Base Sepolia.
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USDC)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    step="0.01"
                    min="0"
                    className="text-lg h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the amount of USDC you want to withdraw
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wormhole Fee</span>
                    <span className="font-medium">
                      {feeLoading ? 'Loading...' : `~${fee} ETH`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-medium">Your wallet on Base Sepolia</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Time</span>
                    <span className="font-medium">2-5 minutes</span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  This will burn your FHE tokens on Sepolia and return USDC to Base Sepolia
                </p>
              </div>

              <DrawerFooter>
                <Button
                  onClick={handleWithdraw}
                  disabled={loading || !amount || parseFloat(amount) <= 0}
                  className="w-full border-cyan-400 text-black bg-cyan-400 hover:bg-cyan-500"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Withdraw {amount || '0'} USDC</>
                  )}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" size="lg">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          ) : (
            <>
              <DrawerHeader>
                <DrawerTitle>Withdrawal Successful!</DrawerTitle>
                <DrawerDescription>
                  Your withdrawal has been submitted. Wait 2-5 minutes for Wormhole to deliver your USDC on Base Sepolia.
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-6 space-y-4">
                <div className="rounded-lg bg-green-500/10 p-4">
                  <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                    Transaction Confirmed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your USDC is being bridged to Base Sepolia via Wormhole.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Transaction Hash</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-xs truncate">
                      {txHash}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <Button onClick={handleClose} className="w-full" size="lg">
                  Done
                </Button>
              </DrawerFooter>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
