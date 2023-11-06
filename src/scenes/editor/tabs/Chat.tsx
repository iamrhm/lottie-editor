import React from 'react';
import usePartySocket from 'partysocket/react';

import useProfileStore from '@/store/useProfile';

import MessageBox from '../components/MessageBox';
import { fetchAllChatRoomMessages } from '@/service/api';

function ChatTab({ roomId }: { roomId: string }) {
  const [messages, setMessages] = React.useState<Array<Message>>([]);
  const { userId, userAvatar, userName } = useProfileStore((store) => store);
  const [value, setValue] = React.useState<string>('');

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || '127.0.0.1:1999',
    room: roomId,
    id: userId!,
    party: 'chat',
    onOpen(event: Event) {
      console.log('New chat session started...!!🚀');
    },
    onMessage(event: MessageEvent<string>) {
      handleNewMessage(event);
    },
  });

  const handleNewMessage = (event: MessageEvent<string>) => {
    const newMessage = JSON.parse(event.data);
    if (Array.isArray(messages) && messages.length) {
      setMessages([...messages, newMessage]);
      return;
    }
    setMessages([newMessage]);
  };

  const sendMessage = () => {
    socket.send(
      JSON.stringify({
        message: value,
        profile: { userId, userAvatar, userName },
      })
    );
    setValue('');
  };

  const onMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setValue(e?.target?.value || '');
  };

  const getAllChatRoomMessages = async (): Promise<void> => {
    const oldExistingMsgs = await fetchAllChatRoomMessages(roomId);
    setMessages(oldExistingMsgs);
  };

  React.useEffect(() => {
    getAllChatRoomMessages();
  }, []);

  return (
    <div className='flex h-[calc(100vh-65px-71px)] w-full flex-col overflow-y-auto p-4'>
      <div className='flex flex-1 flex-col justify-end'>
        {messages?.map((message, indx) => (
          <MessageBox key={indx} message={message} currentUserId={userId!} />
        ))}
      </div>
      <div className='sticky bottom-0 flex items-center gap-4 bg-white'>
        <input
          className='block h-10 w-full flex-1 rounded border border-solid border-neutral-200 bg-slate-100 p-1 outline-none'
          type='text'
          value={value}
          onChange={onMsgChange}
        />
        <button
          className='cursor-pointer rounded bg-emerald-400 px-3 py-2 text-white'
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatTab;
