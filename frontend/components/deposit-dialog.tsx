'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeposit } from '@/hooks/useDeposit';
import { useWormholeFee } from '@/hooks/useWormholeFee';
import { ArrowDownLeft, ExternalLink, Loader2 } from 'lucide-react';

export function DepositDialog() {
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const { deposit, loading, error, txHash } = useDeposit();
  const { fee, loading: feeLoading } = useWormholeFee();

  async function handleDeposit() {
    try {
      await deposit(amount);
      // Don't close dialog immediately - show success message
    } catch (err) {
      console.error(err);
    }
  }

  function handleClose() {
    setOpen(false);
    setAmount('');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-full px-8"
        >
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit USDC to Aave</DialogTitle>
          <DialogDescription>
            Deposit USDC on Base Sepolia to earn yield. Your tokens will be deposited to Aave and you'll receive FHE-encrypted receipt tokens on Sepolia.
          </DialogDescription>
        </DialogHeader>

        {!txHash ? (
          <div className="space-y-4 py-4">
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
              />
              <p className="text-xs text-muted-foreground">
                Enter the amount of USDC you want to deposit
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Wormhole Fee</span>
                <span className="font-medium">
                  {feeLoading ? 'Loading...' : `~${fee} ETH`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium">Aave on Base Sepolia</span>
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

            <Button
              onClick={handleDeposit}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Deposit {amount || '0'} USDC
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You'll need to approve USDC spending and pay the Wormhole fee in ETH
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-green-500/10 p-4 space-y-2">
              <h3 className="font-semibold text-green-600 dark:text-green-400">
                Deposit Successful!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your deposit has been submitted. Wait 2-5 minutes for Wormhole to deliver your receipt tokens on Sepolia.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Transaction Hash</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-2 py-1 text-xs truncate">
                  {txHash}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full" size="lg">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
