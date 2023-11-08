/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';

import { getLottieFromDB } from '@/service/api';
import { FullPageSpinner } from '@/components/Spinner';

function RecentAnimation({
  gifUrl,
  id,
  name,
  deleteEdit,
}: {
  gifUrl: string;
  id: string;
  name: string;
  deleteEdit: (id: string) => void;
}) {
  const router = useRouter();
  const [isUploading, toggleIsUploading] = React.useState(false);

  const downloadFile = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        toggleIsUploading(true);
        const { lottieFile } = await getLottieFromDB(id);
        if (lottieFile) {
          router.push(`/editor/${id}`);
          resolve(id);
        } else {
          throw Error;
        }
      } catch (e) {
        deleteEdit(id);
        toggleIsUploading(false);
        reject(
          (e as any)?.response?.data?.message || 'Failed to process file..!!'
        );
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

  const removeEdit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    deleteEdit(id);
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
            <span className='text-4xl'>
              <MdOutlineImageNotSupported />
            </span>
          )}
        </div>
        <div className='flex w-full items-center justify-between p-2.5 pb-1'>
          <div
            title={name}
            className='max-w-[70%] truncate text-left text-sm font-medium text-gray-900'
          >
            {name}
          </div>
          <span
            className='cursor-pointer rounded-full p-1.5 text-neutral-600 hover:bg-slate-200'
            onClick={removeEdit}
          >
            <RiDeleteBinLine />
          </span>
        </div>
      </div>
      {isUploading && <FullPageSpinner />}
    </>
  );
}

export default RecentAnimation;
