import React from 'react';

import LeftPanel from './sections/LeftPanel';
import RightPanel from './sections/RightPanel';
import EditorView from './sections/EditorView';

export default function Editor() {
  return (
    <main className='flex h-full'>
      <LeftPanel />
      <EditorView />
      <RightPanel />
    </main>
  );
}
