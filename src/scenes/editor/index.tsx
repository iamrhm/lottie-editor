'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import { getLottieJSON } from '@/service/api';
import { useJoinSession } from '@/hooks/useJoinSession';

import LeftPanel from './sections/LeftPanel';
import RightPanel from './sections/RightPanel';
import EditorView from './sections/EditorView';
import useEditorStore from '@/store/useEditor';

export default function Editor() {
  const {
    loadLottie,
    toggleLayerVisibility,
    deleteLayer,
    selectLayer,
    updateLottieColor,
    updateSettings,
  } = useEditorStore((state) => state);
  const { id: roomId } = useParams();
  const [sessionState, sendMessage] = useJoinSession(roomId as string);

  const [isLottieLoaded, setIsLottieLoaded] = React.useState(false);

  const fetchLottie = async (): Promise<void> => {
    setIsLottieLoaded(false);
    try {
      const { lottieFile } = await getLottieJSON(roomId as string);
      loadLottie(lottieFile);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLottieLoaded(true);
    }
  };

  const setLayerVisibility = (layerPath: number[]): void => {
    toggleLayerVisibility(layerPath);
    /* emit socket messages */
    sendMessage({
      type: 'LayerVisibility',
      data: { layerPath, roomId: roomId as string },
    });
  };

  const onDeleteLayer = (layerPath: number[]): void => {
    deleteLayer(layerPath);
    /* emit socket messages */
    sendMessage({
      type: 'DeleteLayer',
      data: { layerPath, roomId: roomId as string },
    });
  };

  const setColor = (updatedColorMap: EditorColorMap): void => {
    updateLottieColor(updatedColorMap);
    /* emit socket messages */
    sendMessage({
      type: 'UpdateColor',
      data: { updatedColorMap, roomId: roomId as string },
    });
  };

  const setSettings = (settings: LottieSettings): void => {
    updateSettings(settings);
    /* emit socket messages */
    sendMessage({
      type: 'UpdateSettings',
      data: { settings, roomId: roomId as string },
    });
  };

  React.useEffect(() => {
    fetchLottie();
  }, [roomId]);

  return (
    <main className='flex h-[calc(100vh-65px)] w-full'>
      {isLottieLoaded && roomId ? (
        <>
          <LeftPanel
            setLayerVisibility={setLayerVisibility}
            onDeleteLayer={onDeleteLayer}
          />
          <EditorView />
          <RightPanel setColor={setColor} setSettings={setSettings} />
        </>
      ) : (
        <> Loading..!! </>
      )}
    </main>
  );
}