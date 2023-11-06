'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { uploadLottieJSON } from '@/service/api';
import useProfileStore from '@/store/useProfile';

function UploadButton() {
  const uploadBtnRef = React.useRef<HTMLInputElement>(null);
  const { userId } = useProfileStore((state) => state);
  const router = useRouter();
  const [isUploading, toggleIsUploading] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    uploadBtnRef?.current?.click();
  };

  const readJsonFile = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target) {
          resolve(JSON.parse(event.target.result as string));
        }
      };
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let toastID = toast.loading('Processing file..!!');
    try {
      e.preventDefault();
      if (e.target.files) {
        const parsedData = (await readJsonFile(
          e.target.files[0]
        )) as LottieJSON;
        const { roomId } = await uploadLottieJSON(userId!, parsedData);
        router.push(`/editor/${roomId}`);
      }
    } catch (e) {
      toast.dismiss(toastID);
      toastID = '';
      toast('Failed to process file..!!');
    } finally {
      if (toastID) {
        toast.dismiss(toastID);
      }
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
