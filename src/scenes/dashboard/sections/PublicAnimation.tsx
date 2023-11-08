'use client';
import React from 'react';
import { useQuery } from '@apollo/client';

import { GET_FEATURED_ANIMATIONS } from '@/service/graphql/query';
import AnimationCard, { IAnimation } from '../components/AnimationCard';
import { Spinner } from '@/components/Spinner';

export type IFeaturedPublicAnimations = {
  featuredPublicAnimations: {
    edges: Array<{ node: IAnimation }>;
  };
};

function PublicAnimation() {
  const { loading, data } = useQuery<IFeaturedPublicAnimations>(
    GET_FEATURED_ANIMATIONS,
    {
      variables: { first: 10 },
    }
  );
  const animationList = data?.featuredPublicAnimations.edges;

  if (loading) {
    return (
      <div className='mt-8 flex h-40 w-full items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='mt-8 w-full flex-col'>
      <h3 className='pb-4 text-left text-lg font-medium text-gray-900'>
        Free community animations
      </h3>
      <div className='flex flex-wrap gap-4'>
        {animationList?.map((animation, index) => (
          <AnimationCard key={animation.node.id} {...animation.node} />
        ))}
      </div>
    </div>
  );
}

export default PublicAnimation;
