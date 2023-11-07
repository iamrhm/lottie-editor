import { getProfileImg } from '@/service/api';
import React from 'react';

function MessageBox({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId: string;
}) {
  return (
    <div
      className={`flex items-center justify-end py-3 ${
        currentUserId === message.profile.userId ? '' : 'flex-row-reverse'
      }`}
    >
      <p className='mx-2 max-w-[150px] break-all rounded-md bg-slate-200 p-2'>
        {message.message}
      </p>
      <div className='flex cursor-pointer items-center justify-center rounded-full border-2 border-emerald-400 text-xs font-medium capitalize'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getProfileImg(message.profile.userId!)}
          alt={message.profile.userName?.charAt(0)}
          className='h-7 w-7 cursor-pointer rounded-full'
          loading='eager'
        />
      </div>
    </div>
  );
}

export default MessageBox;
