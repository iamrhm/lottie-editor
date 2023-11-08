'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

import useSession from '@/store/useSession';
import useProfileStore from '@/store/useProfile';
import { getProfileImg } from '@/service/api';

function LottieSession() {
  const { users } = useSession((store) => store);
  const { userId } = useProfileStore((store) => store);

  const currentPage = usePathname();

  const isEditorRoute = currentPage.includes('editor');

  if (isEditorRoute) {
    return (
      <div className='mr-4 flex items-center p-2'>
        {users
          ?.slice(0, 5)
          ?.filter((user) => user.userId !== userId)
          ?.map((user) => (
            <div
              className='-ml-2 flex cursor-pointer items-center justify-center rounded-full border-2 border-emerald-400 text-xs font-medium'
              key={user.userId}
              title={user.userName!}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getProfileImg(user.userId!)}
                alt={user.userName?.charAt(0)}
                className='h-7 w-7 cursor-pointer rounded-full'
                loading='eager'
              />
            </div>
          ))}
        {users.length > 5 ? (
          <div className='-ml-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-emerald-400 p-2 text-xs font-medium'>
            {users.length - 5}
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

export default LottieSession;
