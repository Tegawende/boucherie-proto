import { Dashboard } from './Dashboard';
import { SalesHistory } from './SalesHistory';

export function StatsScreen() {
  return (
    <div className="flex flex-col lg:flex-row h-full bg-muted/10 overflow-y-auto lg:overflow-hidden">
      {/* Left: Dashboard */}
      <div className="flex-1 lg:h-full lg:overflow-hidden">
        <Dashboard />
      </div>

      {/* Right: Sales History */}
      <div className="w-full lg:w-[400px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-background shadow-sm z-10 h-[600px] lg:h-full">
        <SalesHistory />
      </div>
    </div>
  );
}
