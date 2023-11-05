'use client';
import React from 'react';

import AnimationCard, { IAnimation } from '../components/AnimationCard';

export const defaultData = [
  {
    gifUrl: './data/bouncy-ball.gif',
    src: './data/bouncy-ball.json',
    name: 'Bounce Ball',
    jsonUrl: './data/bouncy-ball.json',
    id: 'bouncyball',
  },
  {
    gifUrl: './data/polite-chicky.gif',
    src: './data/polite-chicky.json',
    name: 'Polite Chicky',
    jsonUrl: './data/polite-chicky.json',
    id: 'politechicky',
  },
];

function FrequentlyUsed() {
  return (
    <div className='w-full flex-col'>
      <h3 className='pb-4 text-left text-lg font-medium text-gray-900'>
        Recently modified
      </h3>
      <div className='flex flex-wrap gap-6'>
        {(defaultData as IAnimation[])?.map((animation, index) => (
          <AnimationCard key={animation.id} {...animation} />
        ))}
      </div>
    </div>
  );
}

export default FrequentlyUsed;
