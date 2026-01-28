import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Employee } from '@/types';
import { employees } from '@/data/employees';

interface AuthContextType {
  currentEmployee: Employee | null;
  isAuthenticated: boolean;
  login: (employeeId: number, pin: string) => boolean;
  logout: () => void;
  employees: Employee[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const login = useCallback((employeeId: number, pin: string): boolean => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee && employee.pin === pin) {
      setCurrentEmployee(employee);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentEmployee(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentEmployee,
        isAuthenticated: currentEmployee !== null,
        login,
        logout,
        employees,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
