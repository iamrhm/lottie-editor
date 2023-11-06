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
      <p className='mr-2 max-w-[150px] rounded-md bg-slate-200 p-2'>
        {message.message}
      </p>
      <div className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-emerald-400 p-2 text-xs font-medium capitalize'>
        <p>{message.profile.userName?.charAt(0)}</p>
      </div>
    </div>
  );
}

export default MessageBox;
