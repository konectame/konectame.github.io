import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { DEFAULT_MARKETPLACE, THEME } from '@/lib/constants';
import { Eye, EyeOff } from 'lucide-react';
import PasswordRecovery from './PasswordRecovery';

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (email !== "alexander.ramirez@konectame.com") {
          await signOut(auth);
          setError(t('auth.notAuthorized'));
          return;
        }
      } else {
        if (email !== "alexander.ramirez@konectame.com") {
          setError(t('auth.notAuthorized'));
          return;
        }
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      }

      navigate('/admin');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message);
    }
  };

  if (isRecovering) {
    return <PasswordRecovery onBack={() => setIsRecovering(false)} />;
  }

  return (
    <div className="flex min-h-screen font-[Poppins]">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img 
              className="h-12 w-auto" 
              src={DEFAULT_MARKETPLACE.logo} 
              alt={DEFAULT_MARKETPLACE.name} 
            />
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-primary-dark">
              {isLogin ? t('auth.login') : t('auth.register')}
            </h2>
            <p className="mt-2 text-sm text-secondary-gray">
              {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-primary-dark hover:text-primary-light"
              >
                {isLogin ? t('auth.register') : t('auth.login')}
              </button>
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-dark">
                  {t('auth.email')}
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-primary-dark outline outline-1 -outline-offset-1 outline-primary-light placeholder:text-secondary-gray focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-dark sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-dark">
                  {t('auth.password')}
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-primary-dark outline outline-1 -outline-offset-1 outline-primary-light placeholder:text-secondary-gray focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-dark sm:text-sm/6 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-gray hover:text-primary-dark" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-gray hover:text-primary-dark" />
                    )}
                  </button>
                </div>
                {isLogin && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setIsRecovering(true)}
                      className="text-sm text-primary-dark hover:text-primary-light"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-primary-dark px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
                >
                  {isLogin ? t('auth.signIn') : t('auth.registerAction')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-primary-dark to-primary-light" />
      </div>
    </div>
  );
}
