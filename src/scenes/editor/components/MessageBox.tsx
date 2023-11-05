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
      <p className='mx-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-100 bg-emerald-400 uppercase'>
        <span className='text-sm'>{message.profile.userName?.charAt(0)}</span>
      </p>
      <p className='max-w-[150px] rounded bg-slate-100 p-2'>
        {message.message}
      </p>
    </div>
  );
}

export default MessageBox;
