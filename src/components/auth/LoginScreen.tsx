import { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Numpad } from '@/components/ui/numpad';
import { cn } from '@/lib/utils';

export function LoginScreen() {
  const { employees, login } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleEmployeeSelect = (employeeId: number) => {
    setSelectedEmployee(employeeId);
    setPin('');
    setError('');
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');

      if (newPin.length === 4 && selectedEmployee) {
        const success = login(selectedEmployee, newPin);
        if (!success) {
          setError('Code PIN incorrect');
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setPin('');
          }, 500);
        }
      }
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleBack = () => {
    setSelectedEmployee(null);
    setPin('');
    setError('');
  };

  const selectedEmployeeData = employees.find((e) => e.id === selectedEmployee);

  return (
    <div className="h-screen max-h-screen bg-muted/30 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 flex flex-col max-h-full">
        {/* Top Logo Section */}
        <div className="text-center shrink-0">
          {!selectedEmployee ? (
            <div className="flex justify-center -mb-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-56 h-56 object-contain drop-shadow-sm transition-all duration-300"
              />
            </div>
          ) : (
            <div className="flex justify-center -mb-1 animate-in fade-in slide-in-from-top-4 duration-300">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-36 h-36 object-contain drop-shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Main Card */}
        <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden flex flex-col shrink">
          <CardHeader className="text-center pb-2 space-y-1 shrink-0 bg-muted/20">
            {selectedEmployee ? (
              <div className="flex flex-col items-center animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3 mb-2 px-3 py-1.5 bg-background rounded-full border shadow-sm">
                  <Avatar className="h-8 w-8 border border-muted">
                    <AvatarFallback className="text-sm bg-primary/10 text-primary">
                      {selectedEmployeeData?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sm">
                    {selectedEmployeeData?.name}
                  </span>
                </div>
                <CardDescription className="text-xs">
                  Entrez votre code PIN
                </CardDescription>
              </div>
            ) : (
              <>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Sélectionnez votre profil
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="pt-4 overflow-y-auto">
            {!selectedEmployee ? (
              <div className="space-y-3">
                {employees.map((employee) => (
                  <Button
                    key={employee.id}
                    variant="outline"
                    className="w-full justify-start h-14 p-2 transition-all hover:border-primary/50 hover:bg-primary/5 group"
                    onClick={() => handleEmployeeSelect(employee.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {employee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-left text-base font-medium">
                      {employee.name}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary/50" />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 flex flex-col items-center">
                {/* PIN Indicators */}
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className={cn('flex justify-center gap-4 h-8 items-center', shake && 'animate-shake')}>
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'w-3 h-3 rounded-full transition-all duration-200',
                          i < pin.length
                            ? 'bg-primary scale-125'
                            : 'bg-muted border border-input'
                        )}
                      />
                    ))}
                  </div>

                  {error && (
                    <Badge variant="destructive" className="px-3 py-1 animate-in zoom-in-95">
                      {error}
                    </Badge>
                  )}
                </div>

                {/* Numpad - Compact Scale */}
                <div className="flex justify-center w-full scale-90 origin-top -mb-4">
                  <Numpad
                    onDigit={handlePinInput}
                    onDelete={handlePinDelete}
                    className="gap-2"
                  />
                </div>

                {/* Back Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground hover:text-foreground h-8 mt-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-3 h-3 mr-2" />
                  Changer d'utilisateur
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-4 shrink-0 font-medium">
          &copy; {new Date().getFullYear()} Boucherie Royale de Saaba.
        </p>
      </div>
    </div>
  );
}
