import React from 'react';

import Modal from './Overlay';

export function Spinner() {
  return (
    <>
      <style jsx>
        {`
          .loader-animation {
            animation: rotate 1s infinite linear;
          }
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div className='flex items-center justify-center'>
        <div className='loader-animation h-[90px] w-[90px] rounded-full border-4 border-slate-300 border-b-transparent border-r-transparent' />
      </div>
    </>
  );
}

export function FullPageSpinner() {
  return (
    <Modal>
      <Spinner />
    </Modal>
  );
}
