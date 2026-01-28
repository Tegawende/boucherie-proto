import { Delete, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface NumpadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onClear?: () => void;
  size?: 'default' | 'large';
  className?: string;
}

export function Numpad({ onDigit, onDelete, onClear, size = 'default', className }: NumpadProps) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  const buttonSize = size === 'large' ? 'h-20 w-20 text-2xl' : 'h-16 w-16 text-xl';

  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {digits.map((digit, index) => {
        if (digit === '') {
          if (onClear) {
            return (
              <Button
                key={index}
                variant="destructive"
                onClick={onClear}
                className={cn(buttonSize, 'rounded-xl')}
              >
                <X className={size === 'large' ? 'h-7 w-7' : 'h-6 w-6'} />
              </Button>
            );
          }
          return <div key={index} />;
        }
        if (digit === 'del') {
          return (
            <Button
              key={index}
              variant="outline"
              onClick={onDelete}
              className={cn(buttonSize, 'rounded-xl')}
            >
              <Delete className={size === 'large' ? 'h-7 w-7' : 'h-6 w-6'} />
            </Button>
          );
        }
        return (
          <Button
            key={index}
            variant="numpad"
            onClick={() => onDigit(digit)}
            className={cn(buttonSize, 'rounded-xl')}
          >
            {digit}
          </Button>
        );
      })}
    </div>
  );
}
