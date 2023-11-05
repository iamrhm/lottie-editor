/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { fetchLottie, uploadLottieJSON } from '@/service/api';
import useProfileStore from '@/store/useProfile';

export type IAnimation = {
  gifUrl: string;
  id: string;
  jsonUrl: string;
  name: string;
};

function FeaturedCard({ gifUrl, jsonUrl, name }: IAnimation) {
  const { userId } = useProfileStore((state) => state);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const lottieJSON: LottieJSON = await fetchLottie(jsonUrl);
    const { roomId } = await uploadLottieJSON(userId!, lottieJSON);
    router.push(`/editor/${roomId}`);
  };

  return (
    <div
      className='w-[240px] flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border border-gray-200 bg-white p-2 shadow-sm'
      onClick={handleClick}
    >
      <div className='flex w-full items-center justify-center '>
        <img
          src={gifUrl}
          alt={name}
          className='h-32 object-contain'
          loading='lazy'
        />
      </div>
      <div className='flex w-full items-center justify-between p-2.5'>
        <div
          title={name}
          className='truncate text-left text-sm font-medium text-gray-900'
        >
          {name}
        </div>
      </div>
    </div>
  );
}

export default FeaturedCard;
