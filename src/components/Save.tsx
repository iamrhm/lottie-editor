'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { saveAs } from 'file-saver';

import useEditorStore from '@/store/useEditor';

function Save() {
  const currentPage = usePathname();
  const { lottieFile } = useEditorStore((store) => store);

  const isEditorRoute = currentPage.includes('editor');

  const handleClick = () => {
    const fileName = `${lottieFile!.nm}.json`;
    const blob = new Blob([JSON.stringify(lottieFile, null, 4)], {
      type: 'application/json',
    });
    saveAs(blob, fileName);
  };

  if (isEditorRoute) {
    return (
      <>
        <button
          className='flex w-[124px] items-center justify-center rounded-md bg-emerald-400 px-3 py-3 text-sm font-semibold text-white hover:bg-emerald-500'
          onClick={handleClick}
        >
          Save
        </button>
      </>
    );
  }
  return null;
}

export default Save;
