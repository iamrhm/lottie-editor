'use client';
import React from 'react';

import useProfileStore, { ProfileStore } from '@/store/useProfile';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { userId, setProfile } = useProfileStore(
    (state: ProfileStore) => state
  );

  const [userName, setUserName] = React.useState<string>('');
  const [showAuthGuard, toggleAuthGuard] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e?.target?.value || '');
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
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
        <div className='flex h-[calc(100vh-65px)] w-full items-center justify-center bg-white text-neutral-800'>
          <div className='rounded bg-white p-6'>
            <h1 className='mb-8 text-center text-xl'>Create your profile</h1>
            <label className='mb-3 flex items-center'>
              <span className='min-w-[100px] shrink-0 text-sm'>Name</span>
              <input
                className='block rounded border border-solid border-neutral-200 bg-slate-100 p-1 outline-none'
                maxLength={10}
                minLength={3}
                value={userName}
                onChange={handleChange}
              />
            </label>
            <button
              className='mt-6 w-full cursor-pointer rounded bg-emerald-400 px-3 py-2 text-white'
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default AuthProvider;
