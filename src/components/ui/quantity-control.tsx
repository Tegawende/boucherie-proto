import { Minus, Plus } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: {
    button: 'h-8 w-8',
    icon: 'h-4 w-4',
    text: 'text-base w-8',
  },
  default: {
    button: 'h-10 w-10',
    icon: 'h-5 w-5',
    text: 'text-lg w-10',
  },
  lg: {
    button: 'h-12 w-12',
    icon: 'h-6 w-6',
    text: 'text-xl w-12',
  },
};

export function QuantityControl({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'default',
  className,
}: QuantityControlProps) {
  const config = sizeConfig[size];

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(config.button, 'rounded-lg')}
      >
        <Minus className={config.icon} />
      </Button>
      <span className={cn('font-bold text-center tabular-nums', config.text)}>
        {value}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(config.button, 'rounded-lg')}
      >
        <Plus className={config.icon} />
      </Button>
    </div>
  );
}
