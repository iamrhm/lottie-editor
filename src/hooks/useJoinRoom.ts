import React from 'react';
import usePartySocket from 'partysocket/react';

import useProfileStore from '@/store/useProfile';
import useEditorStore from '@/store/useEditor';
import useSession from '@/store/useSession';

export const useJoinRoom = (roomId: string): [(action: Action) => void] => {
  const { userName, userId, userAvatar } = useProfileStore((state) => state);

  const {
    toggleLayerVisibility,
    deleteLayer,
    updateLottieColor,
    updateSettings,
  } = useEditorStore((state) => state);

  const { updateSession, updateRoomId } = useSession((store) => store);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_SERVER_URL || '127.0.0.1:1999',
    room: roomId,
    id: userId!,
    onOpen(event: Event) {
      console.log('New Session started...!!🚀');
      onConnect();
    },
    onMessage(event: MessageEvent<string>) {
      console.log('Received new message from server...!!📩');
      handleNewMessage(event);
    },
    onClose(event: Event) {
      leaveRoom();
    },
  });

  const sendMessage = (action: Action) => {
    socket.send(JSON.stringify(action));
  };

  const onConnect = () => {
    const message: UserJoined = {
      type: 'UserJoined',
      data: {
        userName: userName!,
        userId: userId!,
        userAvatar: userAvatar!,
        roomId,
      },
    };
    sendMessage(message);
  };

  const leaveRoom = () => {
    const message: UserLeft = {
      type: 'UserLeft',
      data: {
        userId: userId!,
        roomId,
      },
    };
    sendMessage(message);
  };

  /* sync the store with messaged received form other parties */
  const handleNewMessage = (event: MessageEvent<string>) => {
    const action = JSON.parse(event.data) as Action;
    switch (action.type) {
      case 'UpdateSession':
        console.log('UpdateSession', action);
        updateSession(action.data);
        break;
      case 'LayerVisibility':
        toggleLayerVisibility(action.data.layerPath);
        break;
      case 'DeleteLayer':
        deleteLayer(action.data.layerPath);
        break;
      case 'UpdateColor':
        updateLottieColor(action.data.updatedColorMap);
        break;
      case 'UpdateSettings':
        updateSettings(action.data.settings);
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (roomId) {
      updateRoomId(roomId);
    }
  }, [roomId, updateRoomId]);

  return [sendMessage];
};
