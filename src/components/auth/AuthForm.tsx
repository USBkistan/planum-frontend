import React, { useActionState, useState } from 'react';
import './AuthForm.css';

interface AuthFormProps {
  onAuthSuccess?: (email: string) => void;
}

const authAction = async (prevState: any, formData: FormData, email?: string, password?: string, isRegister?: boolean, onAuthSuccess?: (email: string) => void) => {
  await new Promise((res) => setTimeout(res, 1000));

  if (!email || !password) {
    return { error: "Все поля обязательны!" };
  }

  console.log(isRegister ? "Регистрация..." : "Вход...", { email, password });

  if (onAuthSuccess) {
    onAuthSuccess(email);
  }

  return { success: true, message: isRegister ? "Аккаунт создан!" : "Вы вошли!" };
};

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const isRegister = formData.get('isRegister') === 'true';
    return authAction(prevState, formData, email, password, isRegister, isRegister ? onAuthSuccess : onAuthSuccess);
  }, null);

  return (
    <div className="auth-form-container">
      <div className="auth-form-logo">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#1a1a2e" stroke="#16213e" strokeWidth="4"/>
          <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h2 className="auth-form-title">{isRegister ? 'Регистрация' : 'Вход в систему'}</h2>
      <p className="auth-form-subtitle">
        {isRegister ? 'Создайте аккаунт для начала работы' : 'Войдите для продолжения работы'}
      </p>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="isRegister" value={String(isRegister)} />

        <div className="auth-form-input-group">
          <label>Email</label>
          <input 
            name="email" 
            type="email" 
            placeholder="name@example.com"
            required 
            disabled={isPending} 
          />
        </div>

        <div className="auth-form-input-group">
          <label>Пароль</label>
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••"
            required 
            disabled={isPending} 
          />
        </div>

        {state?.error && <p className="auth-form-error">{state.error}</p>}
        {state?.success && <p className="auth-form-success">{state.message}</p>}

        <button type="submit" disabled={isPending} className="auth-form-button">
          {isPending ? 'Загрузка...' : isRegister ? 'Создать аккаунт' : 'Войти'}
        </button>
      </form>

      <div className="auth-form-divider">
        <span className="auth-form-divider-text">или</span>
      </div>

      <button
        onClick={() => setIsRegister(!isRegister)}
        className="auth-form-switch-btn"
      >
        {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация'}
      </button>
    </div>
  );
};
