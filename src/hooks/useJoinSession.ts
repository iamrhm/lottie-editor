import React from 'react';
import usePartySocket from 'partysocket/react';

import useProfileStore from '@/store/useProfile';
import useEditorStore from '@/store/useEditor';

interface ISessionData {
  roomId: string;
  users: Array<ProfileState>;
}

export const useJoinSession = (
  roomId: string
): [sessionState: ISessionData, (action: ActionPayload) => void] => {
  const { userName, userId, userAvatar } = useProfileStore((state) => state);
  const {
    toggleLayerVisibility,
    deleteLayer,
    updateLottieColor,
    updateSettings,
  } = useEditorStore((state) => state);
  /* session state used to show how many user has joined the same session */
  const [sessionState, setSessionState] = React.useState<ISessionData>({
    roomId,
    users: [],
  });

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
        const newSessionData: ISessionData = { ...sessionState };
        newSessionData.users?.push({ ...action.data });
        setSessionState(newSessionData);
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
        const updatedSessionData: ISessionData = { ...sessionState };
        updatedSessionData.users = updatedSessionData.users.filter(
          (user) => user.userId === action.data.userId
        );
        setSessionState(updatedSessionData);
        break;
      default:
        break;
    }
  };

  return [sessionState, sendMessage];
};
