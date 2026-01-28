import { useState } from 'react';
import { products } from '@/data/products';
import { useSales } from '@/context/SalesContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceDisplay } from '@/components/ui/price-display';
import { QuantityModal } from './QuantityModal';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const categoryConfig: Record<string, { badge: 'beef' | 'chicken' | 'other', border: string, bg: string, text: string }> = {
  'Bœuf': {
    badge: 'beef',
    border: 'border-category-beef-border',
    bg: 'bg-category-beef',
    text: 'text-category-beef-text'
  },
  'Poulet': {
    badge: 'chicken',
    border: 'border-category-chicken-border',
    bg: 'bg-category-chicken',
    text: 'text-category-chicken-text'
  },
  'Autres': {
    badge: 'other',
    border: 'border-category-other-border',
    bg: 'bg-category-other',
    text: 'text-category-other-text'
  },
};

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const config = categoryConfig[product.category] || categoryConfig['Autres'];

  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1',
        'border-2 bg-background',
        config.border
      )}
    >
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
        config.bg
      )} />

      {product.image ? (
        <div className="absolute inset-0 z-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <div className={cn("absolute inset-0 mix-blend-overlay opacity-50", config.bg)}></div>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
      ) : null}

      <CardContent className="p-4 flex flex-col justify-between h-[140px] relative z-10">
        <div>
          <h3 className={cn('font-bold text-lg leading-tight line-clamp-2', config.text)}>
            {product.name}
          </h3>
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1">
            <PriceDisplay amount={product.price} size="lg" className="font-bold text-xl" />
            <span className="text-sm text-muted-foreground">/ {product.unit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductGridContent({ products: productList, onProductClick }: { products: Product[], onProductClick: (product: Product) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-3 md:gap-4 md:p-6">
      {productList.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}

export function ProductGrid() {
  const { addToCart } = useSales();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  const beefProducts = products.filter((p) => p.category === 'Bœuf');
  const chickenProducts = products.filter((p) => p.category === 'Poulet');
  const otherProducts = products.filter((p) => p.category === 'Autres');

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowQuantityModal(true);
  };

  const handleConfirmQuantity = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setShowQuantityModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col h-full bg-muted/10">
      <Tabs defaultValue="tous" className="flex flex-col h-full">
        {/* Category Tabs */}
        <div className="bg-background border-b px-3 py-2 md:px-6 md:py-4 sticky top-0 z-20 shadow-sm/5">
          <TabsList className="w-full h-10 md:h-12 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger
              value="tous"
              className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
            >
              Tous
            </TabsTrigger>
            <TabsTrigger
              value="boeuf"
              className="flex-1 rounded-lg data-[state=active]:bg-category-beef/20 data-[state=active]:text-category-beef-text data-[state=active]:font-bold transition-all"
            >
              Bœuf
            </TabsTrigger>
            <TabsTrigger
              value="poulet"
              className="flex-1 rounded-lg data-[state=active]:bg-category-chicken/20 data-[state=active]:text-category-chicken-text data-[state=active]:font-bold transition-all"
            >
              Poulet
            </TabsTrigger>
            <TabsTrigger
              value="autres"
              className="flex-1 rounded-lg data-[state=active]:bg-category-other/20 data-[state=active]:text-category-other-text data-[state=active]:font-bold transition-all"
            >
              Autres
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Products Grid */}
        <div className="flex-1 h-full overflow-y-auto">
          <TabsContent value="tous" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-full">
            <ProductGridContent products={products} onProductClick={handleProductClick} />
          </TabsContent>
          <TabsContent value="boeuf" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-full">
            <ProductGridContent products={beefProducts} onProductClick={handleProductClick} />
          </TabsContent>
          <TabsContent value="poulet" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-full">
            <ProductGridContent products={chickenProducts} onProductClick={handleProductClick} />
          </TabsContent>
          <TabsContent value="autres" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-full">
            <ProductGridContent products={otherProducts} onProductClick={handleProductClick} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Quantity Modal */}
      <QuantityModal
        open={showQuantityModal}
        onClose={() => {
          setShowQuantityModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onConfirm={handleConfirmQuantity}
      />
    </div>
  );
}
