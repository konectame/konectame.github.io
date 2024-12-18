import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth, storage, db } from '@/lib/firebase';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { useProfile } from '@/contexts/profile';
import { showNotification } from '@/components/ui/Notification';

type TabType = 'basic' | 'password';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const user = auth.currentUser;
  const { updateProfileImage } = useProfile();

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const file = e.target.files[0];
      const storageRef = ref(storage, `${import.meta.env.VITE_ROOT_FOLDER}/${import.meta.env.VITE_MARKETPLACE_ID}/users/${user.uid}/profile`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateProfile(user, { photoURL: downloadURL });
      updateProfileImage(downloadURL); // Update the profile image in context
      
      showNotification(t('profile.imageUpdateSuccess'), 'success');
    } catch (err: any) {
      console.error('Error uploading image:', err);
      showNotification(t('profile.imageUpdateError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: displayName,
        updatedAt: new Date().toISOString()
      });

      showNotification(t('profile.updateSuccess'), 'success');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      showNotification(t('profile.updateError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(t('profile.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      showNotification(t('profile.passwordUpdateSuccess'), 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Error updating password:', err);
      showNotification(t('profile.passwordUpdateError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 font-[Poppins] py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-dark">
            {t('profile.title')}
          </h1>
          <p className="mt-2 text-sm text-secondary-gray">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-primary-light">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`${
                activeTab === 'basic'
                  ? 'border-primary-dark text-primary-dark'
                  : 'border-transparent text-secondary-gray hover:border-primary-light hover:text-primary-dark'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              {t('profile.basicInfo')}
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`${
                activeTab === 'password'
                  ? 'border-primary-dark text-primary-dark'
                  : 'border-transparent text-secondary-gray hover:border-primary-light hover:text-primary-dark'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              {t('profile.changePassword')}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'basic' ? (
            <form onSubmit={handleBasicInfoUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-dark">
                  {t('profile.profileImage')}
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || ''}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-3xl text-secondary-gray">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary-dark shadow-sm ring-1 ring-inset ring-primary-light hover:bg-primary-light">
                    <Upload className="h-4 w-4 inline-block mr-2" />
                    {t('profile.uploadImage')}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary-dark">
                  {t('profile.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-primary-dark outline outline-1 -outline-offset-1 outline-primary-light placeholder:text-secondary-gray focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-dark"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-dark">
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-md bg-gray-50 px-3 py-2 text-secondary-gray outline outline-1 -outline-offset-1 outline-primary-light"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-primary-dark px-3 py-2 text-sm font-semibold text-white hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:opacity-50"
                >
                  {loading ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-primary-dark">
                  {t('profile.currentPassword')}
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="block w-full rounded-md bg-white px-3 py-2 text-primary-dark outline outline-1 -outline-offset-1 outline-primary-light placeholder:text-secondary-gray focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-gray hover:text-primary-dark" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-gray hover:text-primary-dark" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-primary-dark">
                  {t('profile.newPassword')}
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="block w-full rounded-md bg-white px-3 py-2 text-primary-dark outline outline-1 -outline-offset-1 outline-primary-light placeholder:text-secondary-gray focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-gray hover:text-primary-dark" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-gray hover:text-primary-dark" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-dark">
                  {t('profile.confirmPassword')}
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full rounded-md bg-white px-3 py-2 text-primary-dark outline outline-1 -outline-offset-1 outline-primary-light placeholder:text-secondary-gray focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-gray hover:text-primary-dark" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-gray hover:text-primary-dark" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-primary-dark px-3 py-2 text-sm font-semibold text-white hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:opacity-50"
                >
                  {loading ? t('common.saving') : t('profile.updatePassword')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
