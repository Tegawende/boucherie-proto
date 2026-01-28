import { useState } from 'react';
import { Check, Wallet, CircleCheck, CircleX } from 'lucide-react';
import { useSales } from '@/context/SalesContext';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Numpad } from '@/components/ui/numpad';
import { PriceDisplay } from '@/components/ui/price-display';
import { cn } from '@/lib/utils';
import type { Sale } from '@/types';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (sale: Sale) => void;
}

const quickAmounts = [500, 1000, 2000, 5000, 10000];

export function PaymentModal({ open, onClose, onComplete }: PaymentModalProps) {
  const { getCartTotal, completeSale } = useSales();
  const { currentEmployee } = useAuth();
  const [amountInput, setAmountInput] = useState('');

  const total = getCartTotal();
  const amountReceived = parseInt(amountInput) || 0;
  const change = amountReceived - total;
  const canComplete = amountReceived >= total;

  const handleDigitPress = (digit: string) => {
    if (amountInput.length < 8) {
      setAmountInput((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setAmountInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmountInput('');
  };

  const handleQuickAmount = (amount: number) => {
    setAmountInput(String(amount));
  };

  const handleExactAmount = () => {
    setAmountInput(String(total));
  };

  const handleComplete = () => {
    if (canComplete && currentEmployee) {
      const sale = completeSale(amountReceived, currentEmployee.id, currentEmployee.name);
      setAmountInput('');
      onComplete(sale);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAmountInput('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden sm:rounded-2xl border-none shadow-2xl bg-background flex flex-col max-h-screen">
        <DialogHeader className="p-4 pb-2 bg-gradient-to-br from-primary/5 to-transparent shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <Wallet className="w-4 h-4" />
            </div>
            Encaissement
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 space-y-2 flex-1 overflow-y-auto">
          {/* Total à payer */}
          <Card className="p-2 bg-muted/40 border-muted">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-muted-foreground">Total à payer</p>
              <PriceDisplay amount={total} size="xl" className="font-bold text-foreground" />
            </div>
          </Card>

          {/* Montant reçu */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-foreground">Montant reçu</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-5 px-2 text-muted-foreground hover:text-destructive text-[10px]"
              >
                Effacer
              </Button>
            </div>
            <div className={cn(
              "h-10 flex items-center justify-center bg-background border-2 rounded-lg px-3 transition-all duration-200",
              amountInput ? "border-primary ring-2 ring-primary/5" : "border-input"
            )}>
              <span className={cn(
                "text-xl font-bold tabular-nums",
                amountInput ? "text-foreground" : "text-muted-foreground/30"
              )}>
                {amountInput ? parseInt(amountInput).toLocaleString('fr-FR') : '0'} <span className="text-xs text-muted-foreground ml-1 font-normal">FCFA</span>
              </span>
            </div>
          </div>

          {/* Montants rapides */}
          <div className="flex flex-wrap gap-1 justify-center">
            {quickAmounts.map((amount) => (
              <Badge
                key={amount}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground px-2 py-0.5 text-xs transition-all active:scale-95"
                onClick={() => handleQuickAmount(amount)}
              >
                {amount.toLocaleString('fr-FR')}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary/5 hover:border-primary/50 text-primary border-primary/20 px-2 py-0.5 text-xs transition-all active:scale-95"
              onClick={handleExactAmount}
            >
              Exact
            </Badge>
          </div>

          {/* Affichage monnaie */}
          {amountReceived > 0 && (
            <div className={cn(
              'p-1.5 rounded-lg text-center border transition-all duration-300',
              canComplete
                ? 'bg-green-50/50 border-green-200'
                : 'bg-red-50/50 border-red-200'
            )}>
              <div className="flex items-center justify-center gap-1">
                {canComplete ? (
                  <CircleCheck className="w-3 h-3 text-green-600" />
                ) : (
                  <CircleX className="w-3 h-3 text-red-600" />
                )}
                <p className={cn(
                  'text-[10px] font-bold uppercase tracking-wide',
                  canComplete ? 'text-green-700' : 'text-red-700'
                )}>
                  {canComplete ? 'Monnaie à rendre' : 'Manque encore'}
                </p>
                <PriceDisplay
                  amount={canComplete ? change : total - amountReceived}
                  size="lg"
                  className={cn("font-bold ml-1", canComplete ? "text-green-700" : "text-red-700")}
                />
              </div>
            </div>
          )}

          {/* Pavé numérique */}
          <div className="flex justify-center">
            <Numpad
              onDigit={handleDigitPress}
              onDelete={handleDelete}
              size="default"
            />
          </div>

          {/* Bouton validation */}
          <Button
            size="lg"
            className={cn(
              "w-full h-11 text-base font-bold shadow-md transition-all duration-300",
              canComplete ? "shadow-green-500/25 bg-green-600 hover:bg-green-700" : ""
            )}
            onClick={handleComplete}
            disabled={!canComplete}
          >
            <Check className="w-5 h-5 mr-2" />
            Valider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
