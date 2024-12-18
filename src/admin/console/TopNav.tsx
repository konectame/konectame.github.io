import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { User, LogOut, Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

interface TopNavProps {
  className?: string;
}

export function TopNav({ className }: TopNavProps) {
  const { t, i18n } = useTranslation('admin');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const currentUser = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={cn(
      "flex h-16 shrink-0 items-center justify-end gap-x-4 border-b border-gray-200 bg-white px-4",
      className
    )}>
      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          className="flex items-center gap-x-2 rounded-md bg-white p-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none"
        >
          <Globe className="h-5 w-5 text-gray-500" />
          <span>{t(`console.language.${i18n.language}`)}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isLangMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsLangMenuOpen(false)}
            />
            <div className="absolute right-0 z-40 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    i18n.changeLanguage(lang);
                    setIsLangMenuOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100',
                    lang === i18n.language ? 'text-indigo-600 font-medium' : 'text-gray-700'
                  )}
                >
                  {t(`console.language.${lang}`)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-x-2 rounded-md bg-white p-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none"
        >
          {currentUser?.photoURL ? (
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src={currentUser.photoURL}
              alt=""
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <span className="hidden sm:inline-block">{currentUser?.displayName || currentUser?.email || t('console.user')}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isUserMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsUserMenuOpen(false)}
            />
            <div className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  handleSignOut();
                }}
                className="flex w-full items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                {t('console.signOut')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
