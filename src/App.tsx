import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SalesProvider } from '@/context/SalesContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { AppLayout } from '@/components/layout/AppLayout';
import { CaisseScreen } from '@/components/caisse/CaisseScreen';
import { StatsScreen } from '@/components/stats/StatsScreen';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <AppLayout>
      {(view) => (view === 'caisse' ? <CaisseScreen /> : <StatsScreen />)}
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <SalesProvider>
        <AppContent />
      </SalesProvider>
    </AuthProvider>
  );
}

export default App;
