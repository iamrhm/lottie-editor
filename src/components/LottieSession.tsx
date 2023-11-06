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
          ?.slice(0, 5)
          ?.filter((user) => user.userId !== userId)
          ?.map((user) => (
            <div
              className='-ml-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-emerald-400 p-2 text-xs font-medium capitalize'
              key={user.userId}
              title={user.userName!}
            >
              <p>{user.userName?.charAt(0)}</p>
            </div>
          ))}
        {users.length > 5 ? (
          <div className='-ml-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-emerald-400 p-2 text-xs font-medium capitalize'>
            {users.length - 5}
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

export default LottieSession;
