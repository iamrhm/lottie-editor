'use client';
import React from 'react';

import useRecentEdit from '@/store/useRecentEdit';
import useHydratedStore from '@/store/useHydratedStore';

import RecentAnimation from '../components/RecentAnimation';
import UploadButton from '@/components/Upload';

function RecentModified() {
  const { edits } = useHydratedStore(useRecentEdit, (store) => store);
  const { removeEdit } = useRecentEdit((store) => store);

  if (!edits?.length) return null;

  const deleteEdit = (id: string) => {
    removeEdit(id);
  };

  return (
    <div className='mb-8 w-full flex-col'>
      <div className='flex w-full items-center justify-between pb-4'>
        <h3 className='text-left text-lg font-medium text-neutral-900'>
          Recently Modified
        </h3>
        <UploadButton />
      </div>
      <div className='flex flex-wrap gap-6'>
        {edits?.map((animation) => (
          <RecentAnimation
            key={animation.id}
            {...animation}
            deleteEdit={deleteEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default RecentModified;
