import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { User, LogOut, Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { ref, getDownloadURL } from 'firebase/storage';
import md5 from 'md5';
import { Link } from 'react-router-dom';
import { useProfile } from '@/contexts/profile';

interface TopNavProps {
  className?: string;
}

export function TopNav({ className }: TopNavProps) {
  const { t, i18n } = useTranslation('admin');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const currentUser = auth.currentUser;
  const { profileImage } = useProfile();

  const avatarUrl = profileImage || currentUser?.photoURL || '/default-avatar.png';

  useEffect(() => {
    const loadProfileImage = async () => {
      if (!currentUser) return;

      try {
        // Try to get Firebase Storage image
        const rootFolder = import.meta.env.VITE_ROOT_FOLDER;
        const marketplaceId = import.meta.env.VITE_MARKETPLACE_ID;
        const storageRef = ref(storage, `${rootFolder}/${marketplaceId}/users/${currentUser.uid}/profile-image`);
        const url = await getDownloadURL(storageRef);
        // setProfileImage(url);
      } catch (error) {
        // If Firebase Storage image not found, use Gravatar
        if (currentUser.email) {
          const hash = md5(currentUser.email.toLowerCase().trim());
          // setProfileImage(`https://www.gravatar.com/avatar/${hash}?d=mp&s=200`);
        }
      }
    };

    loadProfileImage();
  }, [currentUser]);

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
          className="flex items-center gap-x-2 rounded-md bg-primary-white p-1.5 text-sm font-semibold text-primary-dark hover:bg-primary-light focus:outline-none"
        >
          <Globe className="h-5 w-5 text-primary-dark" />
          <span>{t(`console.language.${i18n.language}`)}</span>
          <ChevronDown className="h-4 w-4 text-primary-dark" />
        </button>

        {isLangMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsLangMenuOpen(false)}
            />
            <div className="absolute right-0 z-40 mt-2 w-40 origin-top-right rounded-md bg-primary-white py-1 shadow-lg ring-1 ring-primary-light">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    i18n.changeLanguage(lang);
                    setIsLangMenuOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center px-4 py-2 text-sm hover:bg-primary-light',
                    lang === i18n.language ? 'text-primary-dark font-medium' : 'text-secondary-gray'
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
          <img
            src={avatarUrl}
            alt={currentUser?.displayName || 'User'}
            className="h-8 w-8 rounded-full"
          />
          <span className="hidden sm:inline-block">{currentUser?.displayName || currentUser?.email || t('console.user')}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isUserMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsUserMenuOpen(false)}
            />
            <div className="absolute right-0 z-40 mt-2 w-80 origin-top-right rounded-md bg-primary-white py-1 shadow-lg ring-1 ring-primary-light">
              <div className="px-4 py-2">
                <p className="text-xs text-secondary-gray">{t('console.signedInAs')}</p>
                <p className="truncate text-sm font-medium text-primary-dark">
                  {currentUser?.email}
                </p>
              </div>
              <div className="border-t border-primary-light" />
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-sm text-primary-dark hover:bg-primary-light"
                onClick={() => setIsUserMenuOpen(false)}
              >
                {t('profile.title')}
              </Link>
              <div className="border-t border-primary-light" />
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  handleSignOut();
                }}
                className="flex w-full items-center gap-x-2 px-4 py-2 text-sm text-primary-dark hover:bg-primary-light"
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
