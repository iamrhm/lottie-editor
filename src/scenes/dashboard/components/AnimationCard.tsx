/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { fetchLottie, uploadLottieJSON } from '@/service/api';
import useProfileStore from '@/store/useProfile';
import { FullPageSpinner } from '@/components/Spinner';

export type IAnimation = {
  gifUrl: string;
  id: string;
  jsonUrl: string;
  name: string;
};

function AnimationCard({ gifUrl, jsonUrl, name }: IAnimation) {
  const { userId } = useProfileStore((store) => store);
  const router = useRouter();
  const [isUploading, toggleIsUploading] = React.useState(false);

  const uploadFile = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        toggleIsUploading(true);
        const lottieJSON: LottieJSON = await fetchLottie(jsonUrl);
        const { roomId } = await uploadLottieJSON(userId!, lottieJSON);
        router.push(`/editor/${roomId}`);
        resolve(roomId);
      } catch (e) {
        reject(
          (e as any)?.response?.data?.message || 'Failed to process file..!!'
        );
      } finally {
        toggleIsUploading(false);
      }
    });
  };

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    toast.promise(
      uploadFile(),
      {
        loading: 'Uploading file',
        success: (data) => `Successfully uploaded`,
        error: (err) => `Failed to upload file`,
      },
      {
        success: {
          icon: '🔥',
        },
      }
    );
  };

  return (
    <>
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
      {isUploading && <FullPageSpinner />}
    </>
  );
}

export default AnimationCard;
