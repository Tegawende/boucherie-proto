import { Printer, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCFA, formatDate } from '@/lib/utils';
import type { Sale } from '@/types';

interface TicketPreviewProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export function TicketPreview({ open, onClose, sale }: TicketPreviewProps) {
  if (!sale) return null;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xs p-0 gap-0 overflow-hidden border-none shadow-2xl bg-zinc-100">
        <div className="bg-white m-4 mb-0 rounded-t-xl shadow-sm p-6 pb-8 relative ticket-scallop-bottom">
          {/* Success Icon */}
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 hidden">
            <div className="bg-green-500 rounded-full p-2 border-4 border-zinc-100">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* En-tête */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 mb-1">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground tracking-tight uppercase">
                Boucherie Royale
              </h2>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                de Saaba
              </p>
            </div>
            <div className="text-[10px] text-muted-foreground space-y-0.5 pt-1">
              <p>Saaba, Burkina Faso</p>
              <p>Tel: +226 XX XX XX XX</p>
            </div>
          </div>

          <Separator className="my-4 border-dashed" />

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-y-1 text-xs mb-6">
            <span className="text-muted-foreground">Date</span>
            <span className="text-right font-medium">{formatDate(sale.date)}</span>

            <span className="text-muted-foreground">Ticket N°</span>
            <span className="text-right font-mono">{sale.id.slice(0, 8).toUpperCase()}</span>

            <span className="text-muted-foreground">Vendeur</span>
            <span className="text-right font-medium">{sale.employeeName}</span>
          </div>

          {/* Articles */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">
              <span>Description</span>
              <span>Montant</span>
            </div>
            <div className="space-y-2">
              {sale.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm group">
                  <div className="flex-1 pr-2">
                    <span className="font-medium text-foreground">{item.product.name}</span>
                    <div className="text-[10px] text-muted-foreground">
                      {item.quantity} x {formatCFA(item.product.price)}
                    </div>
                  </div>
                  <span className="font-medium tabular-nums">
                    {formatCFA(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4 border-dashed" />

          {/* Totaux */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>TOTAL</span>
              <span>{formatCFA(sale.total)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>Espèces</span>
              <span>{formatCFA(sale.amountReceived)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Rendu</span>
              <span>{formatCFA(sale.change)}</span>
            </div>
          </div>

          <div className="mt-8 text-center space-y-1">
            <p className="font-medium text-xs">Merci de votre visite !</p>
            <div className="flex justify-center mt-2">
              {/* Barcode placeholder */}
              <div className="h-8 w-48 bg-foreground/10" />
            </div>
          </div>
        </div>

        {/* Paper tear effect visual */}
        <div className="h-4 bg-transparent -mt-2 z-10 relative">
          <div className="w-full h-full bg-[radial-gradient(circle,transparent_50%,#f4f4f5_50%)] bg-[length:16px_16px] bg-[position:0_10px]" />
        </div>

        {/* Actions */}
        <div className="p-4 bg-zinc-100 flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full border-zinc-300 hover:bg-white"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
