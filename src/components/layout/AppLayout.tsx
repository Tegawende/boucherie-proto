import { useState, type ReactNode } from 'react';
import { ShoppingCart, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type View = 'caisse' | 'stats';

interface AppLayoutProps {
  children: (view: View) => ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { currentEmployee, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('caisse');

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card px-6 py-3 sticky top-0 z-10 shrink-0">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-foreground">Système de Caisse</span>
              <span className="text-[10px] font-medium text-muted-foreground">Version 1.0</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 bg-muted/30 p-1.5 rounded-full border shadow-sm">
            <Button
              variant={currentView === 'caisse' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('caisse')}
              className={cn(
                'gap-2 rounded-full px-8 h-9 transition-all duration-300 font-medium',
                currentView === 'caisse'
                  ? 'bg-white shadow-sm text-primary ring-1 ring-black/5 hover:bg-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Caisse</span>
            </Button>
            <Button
              variant={currentView === 'stats' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('stats')}
              className={cn(
                'gap-2 rounded-full px-8 h-9 transition-all duration-300 font-medium',
                currentView === 'stats'
                  ? 'bg-white shadow-sm text-primary ring-1 ring-black/5 hover:bg-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistiques</span>
            </Button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-11 w-11 rounded-full hover:bg-muted/50 transition-colors p-0.5 ring-2 ring-transparent hover:ring-muted">
                  <Avatar className="h-full w-full border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold">
                      {currentEmployee?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full translate-x-px translate-y-px" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="font-semibold leading-none text-base">{currentEmployee?.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                      <p className="text-xs leading-none text-muted-foreground">En ligne - Poste #{currentEmployee?.id}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10 p-3 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-medium">Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden bg-muted/30 relative mb-16 md:mb-0">
        <div className="absolute inset-0 overflow-y-auto w-full h-full">
          {children(currentView)}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-around px-2 z-50 pb-safe">
        <Button
          variant="ghost"
          onClick={() => setCurrentView('caisse')}
          className={cn(
            'flex flex-col items-center gap-1 h-full flex-1 rounded-none hover:bg-transparent',
            currentView === 'caisse' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <div className={cn(
            "p-1.5 rounded-xl transition-all",
            currentView === 'caisse' ? "bg-primary/10" : "bg-transparent"
          )}>
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Caisse</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setCurrentView('stats')}
          className={cn(
            'flex flex-col items-center gap-1 h-full flex-1 rounded-none hover:bg-transparent',
            currentView === 'stats' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <div className={cn(
            "p-1.5 rounded-xl transition-all",
            currentView === 'stats' ? "bg-primary/10" : "bg-transparent"
          )}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Statistiques</span>
        </Button>
      </div>
    </div>
  );
}
