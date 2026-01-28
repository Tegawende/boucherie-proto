import { useState } from 'react';
import { ChevronDown, ChevronRight, Receipt, User } from 'lucide-react';
import { useSales } from '@/context/SalesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PriceDisplay } from '@/components/ui/price-display';
import { formatCFA, formatDate, formatDateShort, cn } from '@/lib/utils';
import type { Sale } from '@/types';

export function SalesHistory() {
  const { sales } = useSales();
  const [expandedSale, setExpandedSale] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const filteredSales = sales.filter((sale) => sale.date.startsWith(dateFilter));

  const totalForDay = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  const toggleExpand = (saleId: string) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  return (
    <Card className="h-full flex flex-col border-0 rounded-none lg:rounded-xl lg:border lg:shadow-sm bg-background">
      <CardHeader className="flex-shrink-0 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Receipt className="w-5 h-5 text-primary" />
            Historique
          </CardTitle>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[160px] h-9 text-sm"
          />
        </div>

        {/* Total du jour */}
        <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-muted-foreground/10">
          <span className="text-sm font-medium text-muted-foreground">
            Total du {formatDateShort(dateFilter)}
          </span>
          <PriceDisplay amount={totalForDay} size="lg" className="font-bold text-foreground" />
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 bg-muted/5">
        <CardContent className="p-4 pt-4">
          {filteredSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Receipt className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Aucune vente</p>
                <p className="text-sm text-muted-foreground">
                  Aucune transaction enregistrée pour cette date
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSales.map((sale) => (
                <SaleItem
                  key={sale.id}
                  sale={sale}
                  expanded={expandedSale === sale.id}
                  onToggle={() => toggleExpand(sale.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

interface SaleItemProps {
  sale: Sale;
  expanded: boolean;
  onToggle: () => void;
}

function SaleItem({ sale, expanded, onToggle }: SaleItemProps) {
  return (
    <div className={cn(
      'bg-card rounded-xl overflow-hidden transition-all duration-300',
      expanded ? 'shadow-md ring-1 ring-primary/20' : 'border border-border/50 hover:border-border hover:shadow-sm'
    )}>
      <div
        role="button"
        className={cn(
          "w-full flex items-center justify-between p-3 cursor-pointer select-none transition-colors",
          expanded ? "bg-muted/30" : "hover:bg-muted/30"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0',
            expanded ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <PriceDisplay amount={sale.total} size="sm" className="font-bold text-foreground" />
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground bg-muted-foreground/10">
                {sale.items.length} art.
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="font-medium text-foreground/80">{formatDate(sale.date).split(' ')[1]}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {sale.employeeName}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-mono text-muted-foreground/60">#{sale.id.slice(0, 6)}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t">
          <div className="p-3 space-y-1 bg-muted/10">
            {sale.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex-1 pr-4">
                  <div className="font-medium text-foreground">{item.product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCFA(item.product.price)} x {item.quantity}
                  </div>
                </div>
                <div className="font-semibold tabular-nums text-foreground/90">
                  {formatCFA(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="p-3 bg-muted/20 text-xs text-muted-foreground flex justify-between items-center">
            <div className="flex gap-4">
              <span>Reçu: <span className="font-medium text-foreground ml-1">{formatCFA(sale.amountReceived)}</span></span>
              <span>Rendu: <span className="font-medium text-green-600 ml-1">{formatCFA(sale.change)}</span></span>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); /* Add print logic later */ }}>
              <Receipt className="w-3 h-3 mr-1" />
              Reçu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
