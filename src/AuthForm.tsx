import React, { useActionState, useState } from 'react';

const authAction = async (prevState: any, formData: FormData) => {
  const email = formData.get('email');
  const password = formData.get('password');
  const isRegister = formData.get('isRegister') === 'true';

  await new Promise((res) => setTimeout(res, 1000));

  if (!email || !password) {
    return { error: "Все поля обязательны!" };
  }

  console.log(isRegister ? "Регистрация..." : "Вход...", { email, password });
  
  return { success: true, message: isRegister ? "Аккаунт создан!" : "Вы вошли!" };
};

export const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  
  const [state, formAction, isPending] = useActionState(authAction, null);

  return (
    <div style={styles.container}>
      <h2>{isRegister ? 'Регистрация' : 'Вход в систему'}</h2>
      
      <form action={formAction} style={styles.form}>
        <input type="hidden" name="isRegister" value={String(isRegister)} />

        <div style={styles.inputGroup}>
          <label>Email</label>
          <input name="email" type="email" required disabled={isPending} />
        </div>

        <div style={styles.inputGroup}>
          <label>Пароль</label>
          <input name="password" type="password" required disabled={isPending} />
        </div>

        {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
        {state?.success && <p style={{ color: 'green' }}>{state.message}</p>}

        <button type="submit" disabled={isPending} style={styles.button}>
          {isPending ? 'Загрузка...' : isRegister ? 'Создать аккаунт' : 'Войти'}
        </button>
      </form>

      <button 
        onClick={() => setIsRegister(!isRegister)} 
        style={styles.switchBtn}
      >
        {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация'}
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' },
  button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  switchBtn: { marginTop: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }
};
