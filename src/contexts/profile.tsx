import React, { createContext, useContext, useState, useCallback } from 'react';

interface ProfileContextType {
  profileImage: string | null;
  updateProfileImage: (url: string) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profileImage: null,
  updateProfileImage: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const updateProfileImage = useCallback((url: string) => {
    setProfileImage(url);
  }, []);

  return (
    <ProfileContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
