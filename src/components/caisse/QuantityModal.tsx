import { useState, useEffect } from 'react';
import { Scale, Package, X, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceDisplay } from '@/components/ui/price-display';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

type InputMode = 'quantity' | 'price';

interface QuantityModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (product: Product, quantity: number) => void;
}

export function QuantityModal({ open, onClose, product, onConfirm }: QuantityModalProps) {
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<InputMode>('quantity');

  useEffect(() => {
    if (open) {
      setValue('');
      setMode('quantity');
    }
  }, [open]);

  if (!product) return null;

  const isKg = product.unit === 'kg';
  const numericValue = parseFloat(value) || 0;

  // Calculs selon le mode (arrondir à 2 décimales)
  const quantity = mode === 'quantity' ? numericValue : Math.round((numericValue / product.price) * 100) / 100;
  const totalPrice = mode === 'quantity' ? Math.round(numericValue * product.price) : numericValue;

  const handleDigit = (digit: string) => {
    if (mode === 'price') {
      // Mode prix: entiers seulement, max 99999 FCFA
      if (digit === '.') return;
      const newValue = value + digit;
      if (parseInt(newValue) > 99999) return;
      setValue(newValue);
    } else if (isKg) {
      // Pour le poids: max 2 décimales, format X.XX
      if (value.includes('.')) {
        const [, decimals] = value.split('.');
        if (decimals && decimals.length >= 2) return;
      }
      // Éviter plusieurs points
      if (digit === '.' && value.includes('.')) return;
      // Max 99.99 kg
      const newValue = value + digit;
      if (parseFloat(newValue) > 99.99) return;
      setValue(newValue);
    } else {
      // Pour les pièces: entiers seulement, max 99
      if (digit === '.') return;
      const newValue = value + digit;
      if (parseInt(newValue) > 99) return;
      setValue(newValue);
    }
  };

  const handleDecimal = () => {
    if (isKg && !value.includes('.')) {
      setValue(value === '' ? '0.' : value + '.');
    }
  };

  const handleModeChange = (newMode: InputMode) => {
    setMode(newMode);
    setValue('');
  };

  const handleDelete = () => {
    setValue(value.slice(0, -1));
  };

  const handleClear = () => {
    setValue('');
  };

  const handleConfirm = () => {
    if (quantity > 0) {
      onConfirm(product, quantity);
      onClose();
    }
  };

  const handleQuickSelect = (qty: number) => {
    if (mode === 'price') {
      setValue(qty.toString());
    } else {
      setValue(isKg ? qty.toFixed(1) : qty.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              isKg ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
            )}>
              {isKg ? <Scale className="w-6 h-6" /> : <Package className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold">{product.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <PriceDisplay amount={product.price} size="sm" />
                <span className="text-muted-foreground text-sm">/ {product.unit}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Toggle Mode - uniquement pour les produits au kg */}
          {isKg && (
            <Tabs value={mode} onValueChange={(v) => handleModeChange(v as InputMode)} className="w-full">
              <TabsList className="w-full h-10">
                <TabsTrigger value="quantity" className="flex-1 gap-2">
                  <Scale className="w-4 h-4" />
                  Poids
                </TabsTrigger>
                <TabsTrigger value="price" className="flex-1 gap-2">
                  <Wallet className="w-4 h-4" />
                  Montant
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* Affichage valeur */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {mode === 'price'
                ? 'Entrez le montant souhaité'
                : isKg
                  ? 'Entrez le poids en kg'
                  : 'Entrez la quantité'}
            </p>
            <div className="flex items-center justify-center gap-2 py-4 px-6 bg-muted/50 rounded-xl">
              <span className={cn(
                'text-4xl font-bold tabular-nums',
                value ? 'text-foreground' : 'text-muted-foreground/30'
              )}>
                {value || '0'}
              </span>
              <Badge variant="outline" className="text-base px-2 py-1">
                {mode === 'price' ? 'FCFA' : product.unit}
              </Badge>
            </div>
          </div>

          {/* Sélection rapide */}
          <div className="flex gap-2">
            {mode === 'price' ? (
              <>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(500)}>500</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(1000)}>1000</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(2000)}>2000</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(5000)}>5000</Button>
              </>
            ) : isKg ? (
              <>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(0.5)}>0.5 kg</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(1)}>1 kg</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(1.5)}>1.5 kg</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(2)}>2 kg</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(1)}>1</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(2)}>2</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(3)}>3</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleQuickSelect(5)}>5</Button>
              </>
            )}
          </div>

          {/* Numpad */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <Button
                  key={digit}
                  variant="outline"
                  className="h-14 w-14 text-xl font-semibold"
                  onClick={() => handleDigit(digit)}
                >
                  {digit}
                </Button>
              ))}
              {mode === 'quantity' && isKg ? (
                <Button
                  variant="outline"
                  className="h-14 w-14 text-xl font-semibold"
                  onClick={handleDecimal}
                >
                  .
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="h-14 w-14 text-destructive"
                  onClick={handleClear}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
              <Button
                variant="outline"
                className="h-14 w-14 text-xl font-semibold"
                onClick={() => handleDigit('0')}
              >
                0
              </Button>
              <Button
                variant="outline"
                className="h-14 w-14"
                onClick={handleDelete}
              >
                ←
              </Button>
            </div>
          </div>

          {/* Résultat */}
          {numericValue > 0 && (
            <div className="p-3 bg-success/10 rounded-xl border border-success/20 space-y-1">
              {mode === 'price' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Poids à peser</span>
                    <span className="font-bold text-lg text-success tabular-nums">
                      {quantity.toFixed(2)} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Montant</span>
                    <PriceDisplay amount={totalPrice} size="sm" />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-success">Total</span>
                  <PriceDisplay amount={totalPrice} size="lg" className="font-bold text-success" />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleConfirm}
              disabled={quantity <= 0}
            >
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
