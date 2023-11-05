import React from 'react';
import usePartySocket from 'partysocket/react';

import useProfileStore from '@/store/useProfile';
import useEditorStore from '@/store/useEditor';
import useSession from '@/store/useSession';

export const useJoinRoom = (
  roomId: string
): [(action: ActionPayload) => void] => {
  const { userName, userId, userAvatar } = useProfileStore((state) => state);

  const {
    toggleLayerVisibility,
    deleteLayer,
    updateLottieColor,
    updateSettings,
  } = useEditorStore((state) => state);

  const { userJoined, userLeft, updateRoomId } = useSession((store) => store);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_SERVER_URL || '127.0.0.1:1999',
    room: roomId,
    id: userId!,
    onOpen(event: Event) {
      console.log('New Session started...!! 🚀');
      onConnect();
    },
    onMessage(event: MessageEvent<string>) {
      handleNewMessage(event);
    },
  });

  const sendMessage = (action: ActionPayload) => {
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

  /* sync the store with messaged received form other parties */
  const handleNewMessage = (event: MessageEvent<string>) => {
    const action = JSON.parse(event.data) as ActionPayload;
    switch (action.type) {
      case 'UserJoined':
        userJoined(action.data);
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
      case 'UserLeft':
        userLeft(action.data.userId);
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
