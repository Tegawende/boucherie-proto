import { useMemo } from 'react';
import { TrendingUp, ShoppingBag, Package, History, Trophy } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useSales } from '@/context/SalesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceDisplay } from '@/components/ui/price-display';
import { formatCFA, cn } from '@/lib/utils';

// Matches the theme colors
// Matches the theme colors
const CHART_COLORS = ['#991B1B', '#F59E0B', '#7C3AED', '#10B981', '#06B6D4', '#EC4899'];

export function Dashboard() {
  const { sales, getTodaySales, getTodayTotal } = useSales();

  const todaySales = getTodaySales();
  const todayTotal = getTodayTotal();

  const stats = useMemo(() => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number; category: string }> = {};

    todaySales.forEach((sale) => {
      sale.items.forEach((item) => {
        const key = item.product.name;
        if (!productSales[key]) {
          productSales[key] = { name: key, quantity: 0, revenue: 0, category: item.product.category };
        }
        productSales[key].quantity += item.quantity;
        productSales[key].revenue += item.product.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    const categorySales: Record<string, number> = {};
    todaySales.forEach((sale) => {
      sale.items.forEach((item) => {
        const category = item.product.category;
        categorySales[category] = (categorySales[category] || 0) + item.product.price * item.quantity;
      });
    });

    const categoryData = Object.entries(categorySales).map(([name, value]) => ({
      name,
      value,
    }));

    return { topProducts, categoryData };
  }, [todaySales]);

  const hourlyData = useMemo(() => {
    const hours: Record<number, number> = {};
    for (let i = 8; i <= 20; i++) {
      hours[i] = 0;
    }

    todaySales.forEach((sale) => {
      const hour = new Date(sale.date).getHours();
      if (hours[hour] !== undefined) {
        hours[hour] += sale.total;
      }
    });

    return Object.entries(hours).map(([hour, total]) => ({
      hour: `${hour}h`,
      total,
    }));
  }, [todaySales]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full lg:h-full lg:overflow-y-auto p-4 lg:p-6 bg-muted/10">
      {/* Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventes du jour"
          value={todayTotal}
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          bgIcon="bg-green-100"
        />
        <StatCard
          title="Nb transactions"
          value={todaySales.length}
          isNumber
          icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
          bgIcon="bg-blue-100"
        />
        <StatCard
          title="Panier moyen"
          value={todaySales.length > 0 ? Math.round(todayTotal / todaySales.length) : 0}
          icon={<Package className="w-5 h-5 text-amber-600" />}
          bgIcon="bg-amber-100"
        />
        <StatCard
          title="Total historique"
          value={sales.reduce((sum, s) => sum + s.total, 0)}
          icon={<History className="w-5 h-5 text-purple-600" />}
          bgIcon="bg-purple-100"
        />
      </div>

      {/* Hourly Chart */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-2 border-b mb-4">
          <CardTitle className="text-base font-semibold text-foreground">Ventes par heure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12, fill: '#71717A' }}
                  axisLine={{ stroke: '#E4E4E7' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#71717A' }}
                  tickFormatter={(v) => `${v / 1000}k`}
                  axisLine={{ stroke: '#E4E4E7' }}
                />
                <Tooltip
                  formatter={(value) => [formatCFA(Number(value) || 0), 'Ventes']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E4E4E7',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Bar dataKey="total" fill="#991B1B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Pie Chart */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-2 border-b mb-4">
          <CardTitle className="text-base font-semibold text-foreground">Ventes par catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center">
            {stats.categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats.categoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCFA(Number(value) || 0), '']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E4E4E7',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-4">
                  {stats.categoryData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">
                        {formatCFA(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full text-center text-muted-foreground">
                Aucune donnée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="lg:col-span-2 shadow-sm border-border/50">
        <CardHeader className="pb-2 border-b mb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Trophy className="w-5 h-5 text-primary" />
            Produits les plus vendus
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="p-4 rounded-xl flex items-center gap-3 border bg-card hover:shadow-sm transition-shadow"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm',
                      index === 0 && 'bg-yellow-100 text-yellow-700 border border-yellow-200',
                      index === 1 && 'bg-zinc-100 text-zinc-700 border border-zinc-200',
                      index === 2 && 'bg-orange-100 text-orange-700 border border-orange-200',
                      index > 2 && 'bg-muted text-muted-foreground border border-border'
                    )}
                  >
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-foreground text-sm">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.quantity} vendu{product.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                  <PriceDisplay amount={product.revenue} size="sm" className="font-bold text-foreground" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-8">
              Aucune vente aujourd'hui
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgIcon: string;
  isNumber?: boolean;
}

function StatCard({ title, value, icon, bgIcon, isNumber }: StatCardProps) {
  return (
    <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn('p-3 rounded-xl', bgIcon)}>{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            {isNumber ? (
              <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
            ) : (
              <PriceDisplay amount={value} size="lg" className="font-bold text-foreground" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
