'use client';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import useProfileStore, { ProfileStore } from '@/store/useProfile';

import Modal from '@/components/Overlay';
import InputBox from '@/components/InputBox';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { userId, setProfile } = useProfileStore(
    (store: ProfileStore) => store
  );

  const [userName, setUserName] = React.useState<string>('');
  const [showAuthGuard, toggleAuthGuard] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e?.target?.value || '');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setProfile(userName);
    toggleAuthGuard(false);
  };

  React.useEffect(() => {
    if (!userId) {
      toggleAuthGuard(true);
    }
  }, [userId]);

  return (
    <>
      {showAuthGuard ? (
        <Modal>
          <div className='relative flex max-h-[480px] min-h-[120px] min-w-[120px] max-w-[540px] transform items-center justify-center overflow-hidden rounded-lg border border-slate-500 bg-white px-6 py-4 shadow-sm transition-all'>
            <div className='flex flex-col'>
              <h1 className='mb-8 text-left text-xl'>Signup</h1>
              <form onSubmit={handleSubmit}>
                <InputBox
                  label='Name'
                  maxLength={10}
                  minLength={3}
                  value={userName}
                  onChange={handleChange}
                />
                <button
                  className='mt-4 w-full cursor-pointer rounded bg-emerald-400 px-3 py-2 text-white'
                  type='submit'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Modal>
      ) : (
        children
      )}
      <Toaster position='bottom-left' />
    </>
  );
}

export default AuthProvider;
