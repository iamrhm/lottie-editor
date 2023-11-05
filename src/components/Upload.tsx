'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

import { uploadLottieJSON } from '@/service/api';
import useProfileStore from '@/store/useProfile';

function UploadButton() {
  const uploadBtnRef = React.useRef<HTMLInputElement>(null);
  const { userId } = useProfileStore((state) => state);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    uploadBtnRef?.current?.click();
  };

  const readJsonFile = (file: Blob) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target) {
          resolve(JSON.parse(event.target.result as string));
        }
      };
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      if (e.target.files) {
        enqueueSnackbar('Processing file..!!');
        const parsedData = (await readJsonFile(
          e.target.files[0]
        )) as LottieJSON;
        const { roomId } = await uploadLottieJSON(userId!, parsedData);
        router.push(`/editor/${roomId}`);
      }
    } catch (e) {
      closeSnackbar();
      enqueueSnackbar('Failed to process file..!!');
    }
  };

  return (
    <>
      <input
        type='file'
        accept='.json,application/json'
        onChange={handleUpload}
        className='hidden'
        ref={uploadBtnRef}
      />
      <button
        className='flex h-8 items-center justify-center rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500'
        onClick={handleClick}
      >
        Upload animations
      </button>
    </>
  );
}

export default UploadButton;
