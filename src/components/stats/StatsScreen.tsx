import { Dashboard } from './Dashboard';
import { SalesHistory } from './SalesHistory';

export function StatsScreen() {
  return (
    <div className="flex h-full bg-muted/10">
      {/* Left: Dashboard */}
      <div className="flex-1 overflow-hidden">
        <Dashboard />
      </div>

      {/* Right: Sales History */}
      <div className="w-[400px] flex-shrink-0 border-l border-border bg-background shadow-sm z-10">
        <SalesHistory />
      </div>
    </div>
  );
}
