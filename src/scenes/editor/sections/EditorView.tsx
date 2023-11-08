'use client';
import React from 'react';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

import useEditorStore, { EditorStore } from '@/store/useEditor';

function EditorView() {
  const animationData = useEditorStore((state: EditorStore) =>
    JSON.stringify(state.lottieFile)
  );

  /* TODO: animation flow */
  React.useEffect(() => {
    /* console.log('updating'); */
  });

  return (
    <div className='flex w-full flex-col items-center justify-center border-x border-neutral-300 bg-slate-200'>
      <Player
        src={JSON.parse(animationData)}
        autoplay
        loop
        style={{
          width: '400px',
          height: '400px',
          background: 'transparent',
          margin: '0px auto',
          outline: 'none',
          overflow: 'hidden',
        }}
        id='lottie'
      >
        <Controls
          visible={true}
          buttons={['play', 'repeat', 'frame', 'debug']}
        />
      </Player>
    </div>
  );
}

export default EditorView;
