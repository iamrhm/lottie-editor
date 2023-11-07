'use client';
import React from 'react';

import useRecentEdit from '@/store/useRecentEdit';

import RecentAnimation from '../components/RecentAnimation';
import UploadButton from '@/components/Upload';

function RecentModified() {
  const { edits } = useRecentEdit((store) => store);
  const [recentlyModified, setRecentModified] = React.useState<
    Array<{
      id: string;
      gifUrl: string;
    }>
  >([]);

  React.useEffect(() => {
    if (edits.length) {
      setRecentModified(edits);
    }
  }, [edits]);

  if (!recentlyModified.length) return null;
  return (
    <div className='mb-8 w-full flex-col'>
      <div className='flex w-full items-center justify-between pb-4'>
        <h3 className='text-left text-lg font-medium text-neutral-900'>
          Recently Modified
        </h3>
        <UploadButton />
      </div>
      <div className='flex flex-wrap gap-6'>
        {recentlyModified?.map((animation) => (
          <RecentAnimation key={animation.id} {...animation} />
        ))}
      </div>
    </div>
  );
}

export default RecentModified;
