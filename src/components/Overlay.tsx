import React from 'react';

interface IProps {}

function Overlay({ children }: { children?: React.ReactNode }) {
  return (
    <div className='fixed left-0 top-0 z-[999] flex min-h-screen w-full items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity'>
      <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
      {children}
    </div>
  );
}

export default Overlay;
