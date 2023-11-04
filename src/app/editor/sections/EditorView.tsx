import React from 'react';
import Lottie from 'lottie-react';

function EditorView({ lottieFile }: { lottieFile: string }) {
  React.useEffect(() => {
    console.log('updating');
  });

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-slate-200'>
      <Lottie
        animationData={JSON.parse(lottieFile)}
        style={{
          width: '400px',
          height: '400px',
          background: 'transparent',
          margin: '0px auto',
          outline: 'none',
          overflow: 'hidden',
        }}
        id='lottie'
      />
    </div>
  );
}

export default React.memo(EditorView);
