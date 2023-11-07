import React from 'react';
import usePartySocket from 'partysocket/react';

import useProfileStore from '@/store/useProfile';

import MessageBox from '../components/MessageBox';
import { fetchAllChatRoomMessages } from '@/service/api';
import InputBox from '@/components/InputBox';
import { clearTimeout } from 'timers';

function ChatTab({ roomId }: { roomId: string }) {
  const [messages, setMessages] = React.useState<Array<Message>>([]);
  const { userId, userName } = useProfileStore((store) => store);
  const [value, setValue] = React.useState<string>('');

  const ref = React.useRef<HTMLDivElement>(null);
  const timeRef = React.useRef<number>();

  const scrollToBottom = () => {
    window?.clearTimeout(timeRef.current);
    if (ref.current) {
      /* for type safety */
      timeRef.current = window?.setTimeout(() => {
        ref?.current?.scrollTo({
          top: ref?.current?.scrollHeight,
          behavior: 'smooth',
        });
      }, 200);
    }
  };

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
      scrollToBottom();
      return;
    }
    setMessages([newMessage]);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.send(
      JSON.stringify({
        message: value,
        profile: { userId, userName },
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
    scrollToBottom();
  };

  React.useEffect(() => {
    getAllChatRoomMessages();
    return () => {
      if (timeRef.current) {
        window?.clearTimeout(timeRef.current);
      }
    };
  }, []);

  return (
    <div
      className='flex h-[calc(100vh-65px-49px)] w-full flex-col overflow-y-auto'
      ref={ref}
    >
      <div className='flex flex-1 flex-col justify-end p-4'>
        {messages?.map((message, indx) => (
          <MessageBox key={indx} message={message} currentUserId={userId!} />
        ))}
      </div>
      <form
        className='sticky bottom-0 flex items-center gap-4 bg-white p-4'
        onSubmit={sendMessage}
      >
        <InputBox
          type='text'
          value={value}
          onChange={onMsgChange}
          classNames='h-10 w-48 flex-1'
        />
        <button
          className='cursor-pointer rounded bg-emerald-400 px-3 py-2 text-white'
          type='submit'
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatTab;
