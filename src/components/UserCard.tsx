'use client';
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { RiLogoutCircleRLine } from 'react-icons/ri';

import { getProfileImg } from '@/service/api';

import useProfileStore from '@/store/useProfile';
import useHydratedStore from '@/store/useHydratedStore';

function UserCard() {
  const { userName, userId } = useHydratedStore(
    useProfileStore,
    (store) => store
  );
  const { logout } = useProfileStore((store) => store);

  return (
    <>
      {userName && userId ? (
        <div className='flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-100 p-2 shadow-sm'>
          <div className='flex w-full items-center gap-3'>
            <img
              className='h-8 w-8 rounded-full bg-white shadow-lg'
              src={getProfileImg(userId)}
              alt={userName}
            />
            <span
              className='text-sm font-medium text-neutral-800'
              title={userName}
            >
              You ({userName})
            </span>
          </div>
          <button
            className='flex cursor-pointer items-center justify-center rounded-full border-0 p-2 outline-none hover:bg-slate-200'
            onClick={logout}
          >
            <RiLogoutCircleRLine />
          </button>
        </div>
      ) : null}
    </>
  );
}

export default UserCard;
