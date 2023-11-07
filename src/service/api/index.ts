import axios from 'axios';
import { nanoid } from 'nanoid';

const getPartyURL = (pathname: string): string => {
  const PartyURL = `${process.env.NEXT_PUBLIC_PARTYKIT_HOST}/parties/${pathname}`;
  return PartyURL;
};

export const fetchExternalLottie = async (
  lottieUrl: string
): Promise<LottieJSON> => {
  const { data } = await axios.get(lottieUrl);
  return data;
};

export const uploadToDB = async (
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
  const pathname = `main/${roomId}`;
  await axios.post(`${getPartyURL(pathname)}`, data);
  return { roomId };
};

export const getLottieFromDB = async (
  roomId: string
): Promise<{ lottieFile: LottieJSON }> => {
  const pathname = `main/${roomId}`;
  const { data } = await axios.get(`${getPartyURL(pathname)}`);
  return data;
};

export const fetchChatThread = async (
  roomId: string
): Promise<Array<Message>> => {
  const pathname = `chat/${roomId}`;
  const { data } = await axios.get(`${getPartyURL(pathname)}`);
  return data.message;
};

export const getProfileImg = (userId: string): string => {
  if (userId) {
    return `https://gravatar.com/avatar/${userId}?s=200&d=robohash&r=x`;
  }
  return '';
};
