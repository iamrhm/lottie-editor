import axios from 'axios';

export const fetchLottie = async (jsonUrl: string): Promise<LottieJSON> => {
  const { data } = await axios.get(jsonUrl);
  return data;
};

export const uploadLottieJSON = async (lottie: LottieJSON): Promise<void> => {};
