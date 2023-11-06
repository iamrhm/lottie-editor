import axios from 'axios';
import { nanoid } from 'nanoid';

const getPartyURL = (roomId: string): string => {
  const PartyURL = `${process.env.NEXT_PUBLIC_PARTYKIT_HOST}/parties/main/${roomId}`;
  return PartyURL;
};

export const fetchLottie = async (lottieUrl: string): Promise<LottieJSON> => {
  const { data } = await axios.get(lottieUrl);
  return data;
};

export const uploadLottieJSON = async (
  userId: string,
  lottie: LottieJSON
): Promise<{
  roomId: string;
}> => {
  const roomId = nanoid();
  const data = {
    roomId,
    lottieFile: lottie,
    userId,
  };
  await axios.post(`${getPartyURL(roomId)}`, data);
  return { roomId };
};

export const getLottieJSON = async (
  roomId: string
): Promise<{ lottieFile: LottieJSON }> => {
  const { data } = await axios.get(`${getPartyURL(roomId)}`);
  return data;
};

export const fetchAllChatRoomMessages = async (
  roomId: string
): Promise<Array<Message>> => {
  const { data } = await axios.get(`${getPartyURL(`chat/${roomId}`)}`);
  return data;
};
