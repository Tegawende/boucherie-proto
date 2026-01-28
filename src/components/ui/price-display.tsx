import { cn } from '@/lib/utils';
import { formatCFA } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  variant?: 'default' | 'success' | 'muted' | 'primary';
  className?: string;
  showCurrency?: boolean;
}

const sizeClasses = {
  sm: 'text-sm font-semibold',
  md: 'text-base font-bold',
  lg: 'text-lg font-bold',
  xl: 'text-xl font-bold',
  '2xl': 'text-2xl font-extrabold',
  '3xl': 'text-3xl font-extrabold',
};

const variantClasses = {
  default: 'text-foreground',
  success: 'text-green-600',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
};

export function PriceDisplay({
  amount,
  size = 'md',
  variant = 'default',
  className,
  showCurrency = true,
}: PriceDisplayProps) {
  const formattedAmount = showCurrency
    ? formatCFA(amount)
    : amount.toLocaleString('fr-FR');

  return (
    <span
      className={cn(
        'tabular-nums tracking-tight',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {formattedAmount}
    </span>
  );
}
