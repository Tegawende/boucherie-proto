import { useState } from 'react';
import { ProductGrid } from './ProductGrid';
import { Cart } from './Cart';
import { PaymentModal } from './PaymentModal';
import { TicketPreview } from './TicketPreview';
import type { Sale } from '@/types';

export function CaisseScreen() {
  const [showPayment, setShowPayment] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = (sale: Sale) => {
    setLastSale(sale);
    setShowPayment(false);
    setShowTicket(true);
  };

  const handleTicketClose = () => {
    setShowTicket(false);
    setLastSale(null);
  };

  return (
    <div className="flex h-full w-full bg-muted/30">
      {/* Left: Product Grid */}
      <div className="flex-1 flex flex-col min-w-0 pr-0 lg:pr-1">
        <ProductGrid />
      </div>

      {/* Right: Cart */}
      <div className="w-96 flex-shrink-0 bg-background border-l shadow-2xl shadow-black/5 z-10 transition-all duration-300">
        <Cart onCheckout={handleCheckout} />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        onComplete={handlePaymentComplete}
      />

      {/* Ticket Preview */}
      <TicketPreview
        open={showTicket}
        onClose={handleTicketClose}
        sale={lastSale}
      />
    </div>
  );
}
