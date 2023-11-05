import axios from 'axios';
import { nanoid } from 'nanoid';

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
  await axios.post(`http://localhost:1999/parties/main/${roomId}`, data);
  return { roomId };
};

export const getLottieJSON = async (
  roomId: string
): Promise<{ lottieFile: LottieJSON }> => {
  const { data } = await axios.get(
    `http://localhost:1999/parties/main/${roomId}`
  );
  return data;
};
