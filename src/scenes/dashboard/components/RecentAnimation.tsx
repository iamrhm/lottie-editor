/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import useRecentEdit from '@/store/useRecentEdit';

import { getLottieFromDB } from '@/service/api';
import { FullPageSpinner, Spinner } from '@/components/Spinner';

function RecentAnimation({ gifUrl, id }: { gifUrl: string; id: string }) {
  const { removeEdit } = useRecentEdit((store) => store);

  const router = useRouter();
  const [isUploading, toggleIsUploading] = React.useState(false);

  const downloadFile = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        toggleIsUploading(true);
        const { lottieFile } = await getLottieFromDB(id);
        if (lottieFile) {
          router.push(`/editor/${id}`);
          resolve('Success');
        } else {
          removeEdit(id);
          reject(id);
        }
      } catch (e) {
        removeEdit(id);
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
      downloadFile(),
      {
        loading: 'Loading file',
        success: (data) => `Successfully loaded`,
        error: (err) => `Failed to load file`,
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
        <div className='flex h-32 w-full items-center justify-center'>
          {gifUrl ? (
            <img
              src={gifUrl}
              alt={id}
              className='h-32 object-contain'
              loading='lazy'
            />
          ) : (
            <Spinner classNames='h-[32px] w-[32px]' />
          )}
        </div>
        <div className='flex w-full items-center justify-between p-2.5'></div>
      </div>
      {isUploading && <FullPageSpinner />}
    </>
  );
}

export default RecentAnimation;