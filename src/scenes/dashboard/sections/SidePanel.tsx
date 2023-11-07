'use client';

import React from 'react';
import { RxDashboard } from 'react-icons/rx';

import UserCard from '@/components/UserCard';
import useProfileStore from '@/store/useProfile';

function SidePanel() {
  const { userName, userId } = useProfileStore((store) => store);
  return (
    <div className='relative w-[250px] flex-shrink-0 border-r border-neutral-200 bg-white px-2 pt-4'>
      <div
        className={`mt-2 flex w-full cursor-pointer flex-col justify-end rounded-md bg-slate-200 px-2 py-2`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm'>
              <RxDashboard />
            </span>
            <p className={`text-sm font-medium text-neutral-700`}>Dashboard</p>
          </div>
        </div>
      </div>
      <div className='absolute bottom-4 left-0 w-full p-2'>
        <UserCard />
      </div>
    </div>
  );
}

export default SidePanel;
