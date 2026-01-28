import { Trash2, ShoppingCart, Receipt } from 'lucide-react';
import { useSales } from '@/context/SalesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuantityControl } from '@/components/ui/quantity-control';
import { PriceDisplay } from '@/components/ui/price-display';
import { cn } from '@/lib/utils';

interface CartProps {
  onCheckout: () => void;
}

export function Cart({ onCheckout }: CartProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useSales();

  const total = getCartTotal();
  const isEmpty = cart.length === 0;
  const itemCount = cart.length;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">Panier</h2>
              {!isEmpty && (
                <Badge variant="secondary" className="font-normal text-xs">
                  {itemCount} article{itemCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          {!isEmpty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Vider
            </Button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 bg-muted/10">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground p-8 animate-in fade-in duration-500">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Receipt className="w-10 h-10 opacity-30" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">Votre panier est vide</p>
            <p className="text-sm text-center max-w-[200px]">
              Sélectionnez des produits dans la liste pour commencer une vente
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <Card key={item.product.id} className="group border-transparent shadow-sm hover:shadow-md hover:border-border transition-all duration-200">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-3">
                      <h3 className="font-semibold text-sm leading-tight text-foreground mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item.product.price.toLocaleString('fr-FR')} FCFA / {item.product.unit}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.product.id)}
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    {item.product.unit === 'kg' ? (
                      <Badge variant="secondary" className="px-3 py-1.5 text-sm font-semibold">
                        {item.quantity.toFixed(2)} kg
                      </Badge>
                    ) : (
                      <QuantityControl
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.product.id, value)}
                        size="sm"
                      />
                    )}
                    <PriceDisplay
                      amount={Math.round(item.product.price * item.quantity)}
                      size="md"
                      className="font-bold text-primary"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="bg-card border-t p-6 pb-8 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] z-20">
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total à payer</span>
            <PriceDisplay amount={total} size="2xl" className="font-extrabold text-foreground" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={clearCart}
              disabled={isEmpty}
              className="h-12 font-medium border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive hover:border-destructive/40"
            >
              Annuler
            </Button>
            <Button
              variant="default" // Changed from success to default as success isnt standard and I can style it
              size="lg"
              onClick={onCheckout}
              disabled={isEmpty}
              className={cn(
                "h-12 font-bold shadow-lg shadow-primary/25",
                !isEmpty ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground"
              )}
            >
              Encaisser
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
