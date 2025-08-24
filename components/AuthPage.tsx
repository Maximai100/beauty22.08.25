import React, { useState } from 'react';

interface AuthPageProps {
  onLoginSuccess: (userId: string) => void;
}

const Spinner = ({className = "h-5 w-5"}) => <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const url = isLoginView ? `/api/auth/login` : `/api/auth/register`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так');
      }
      
      onLoginSuccess(data.id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-body">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-card shadow-card-hover border border-border">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary font-heading">
                {isLoginView ? 'С возвращением!' : 'Создать аккаунт'}
            </h1>
            <p className="mt-2 text-text-secondary">
                {isLoginView ? 'Войдите, чтобы продолжить работу.' : 'Присоединяйтесь к нам, чтобы создать свой сайт.'}
            </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 ease-smooth" 
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-text-secondary mb-1">Пароль</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="current-password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 ease-smooth" 
            />
          </div>
          
          {error && <p className="text-sm text-center text-error">{error}</p>}
          
          <div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-component shadow-elegant text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-all duration-300 ease-smooth disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : (isLoginView ? 'Войти' : 'Зарегистрироваться')}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-text-secondary">
          {isLoginView ? "Еще нет аккаунта? " : "Уже есть аккаунт? "}
          <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-medium text-primary-focus hover:underline">
            {isLoginView ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
};