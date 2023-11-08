'use client';
import React from 'react';

import useRecentEdit from '@/store/useRecentEdit';
import useHydratedStore from '@/store/useHydratedStore';

import AnimationCard, { IAnimation } from '../components/AnimationCard';
import UploadButton from '@/components/Upload';

export const defaultData = [
  {
    gifUrl: './data/bouncy-ball.gif',
    src: './data/bouncy-ball.json',
    name: 'Bounce Ball',
    jsonUrl: './data/bouncy-ball.json',
    id: 'bouncy-ball',
  },
  {
    gifUrl: './data/polite-chicky.gif',
    src: './data/polite-chicky.json',
    name: 'Polite Chicky',
    jsonUrl: './data/polite-chicky.json',
    id: 'polite-chicky',
  },
];

function FrequentlyUsed() {
  const { edits } = useHydratedStore(useRecentEdit, (store) => store);

  return (
    <div className='w-full flex-col'>
      <div className='flex w-full items-center justify-between pb-4'>
        <h3 className='text-left text-lg font-medium text-neutral-900'>
          Get Started
        </h3>
        {!edits?.length ? <UploadButton /> : null}
      </div>
      <div className='flex flex-wrap gap-6'>
        {(defaultData as IAnimation[])?.map((animation) => (
          <AnimationCard key={animation.id} {...animation} />
        ))}
      </div>
    </div>
  );
}

export default FrequentlyUsed;
