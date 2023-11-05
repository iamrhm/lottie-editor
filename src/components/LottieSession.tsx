'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

import useSession from '@/store/useSession';
import useProfileStore from '@/store/useProfile';

function LottieSession() {
  const { users } = useSession((store) => store);
  const { userId } = useProfileStore((store) => store);

  const currentPage = usePathname();

  const isEditorRoute = currentPage.includes('editor');

  if (isEditorRoute) {
    return (
      <div className='mr-4 flex items-center p-2'>
        {users
          ?.filter((user) => user.userId !== userId)
          ?.map((user) => (
            <div
              className='-ml-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-emerald-100 bg-emerald-400 p-2 font-semibold capitalize'
              key={user.userId}
              title={user.userName!}
            >
              {user.userName?.charAt(0)}
            </div>
          ))}
      </div>
    );
  }
  return null;
}

export default LottieSession;
