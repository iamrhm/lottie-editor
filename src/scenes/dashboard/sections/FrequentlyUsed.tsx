'use client';
import React from 'react';

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
  return (
    <div className='w-full flex-col'>
      <div className='flex w-full items-center justify-between pb-4'>
        <h3 className='text-left text-lg font-medium text-gray-900'>
          Recently modified
        </h3>
        <UploadButton />
      </div>
      <div className='flex flex-wrap gap-6'>
        {(defaultData as IAnimation[])?.map((animation, index) => (
          <AnimationCard key={animation.id} {...animation} />
        ))}
      </div>
    </div>
  );
}

export default FrequentlyUsed;
