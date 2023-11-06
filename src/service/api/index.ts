import axios from 'axios';
import { nanoid } from 'nanoid';

const getPartyURL = (): string => {
  const PartyURL = `${
    typeof window !== undefined ? window?.location?.protocol : 'http'
  }//${
    process.env.NEXT_PUBLIC_PARTYKIT_HOST || '127.0.0.1:1999'
  }/parties/main/`;
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
  await axios.post(`${getPartyURL()}${roomId}`, data);
  return { roomId };
};

export const getLottieJSON = async (
  roomId: string
): Promise<{ lottieFile: LottieJSON }> => {
  const { data } = await axios.get(`${getPartyURL()}${roomId}`);
  return data;
};
