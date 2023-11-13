'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import { getLottieFromDB } from '@/service/api';
import { useJoinRoom } from '@/hooks/useJoinRoom';
import useEditorStore from '@/store/useEditor';

import LeftPanel from './sections/LeftPanel';
import RightPanel from './sections/RightPanel';
import EditorView from './sections/EditorView';
import { FullPageSpinner } from '@/components/Spinner';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Editor() {
  const {
    loadLottie,
    toggleLayerVisibility,
    deleteLayer,
    updateLottieColor,
    updateSettings,
    updateAllUniqueColors,
  } = useEditorStore((state) => state);
  const { id: roomId } = useParams();
  const [sendMessage] = useJoinRoom(roomId as string);
  const [isLottieLoaded, setIsLottieLoaded] = React.useState(false);

  const fetchLottie = async (): Promise<void> => {
    setIsLottieLoaded(false);
    try {
      const { lottieFile } = await getLottieFromDB(roomId as string);
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
    } as LayerVisibility);
  };

  const onDeleteLayer = (layerPath: number[]): void => {
    deleteLayer(layerPath);
    /* emit socket messages */
    sendMessage({
      type: 'DeleteLayer',
      data: { layerPath, roomId: roomId as string },
    } as DeleteLayer);
  };

  const setColor = (updatedColorMap: EditorColorMap): void => {
    updateLottieColor(updatedColorMap);
    /* emit socket messages */
    sendMessage({
      type: 'UpdateColor',
      data: { updatedColorMap, roomId: roomId as string },
    } as UpdateColor);
  };

  const setSettings = (settings: LottieSettings): void => {
    updateSettings(settings);
    /* emit socket messages */
    sendMessage({
      type: 'UpdateSettings',
      data: { settings, roomId: roomId as string },
    } as UpdateSettings);
  };

  const changeUniqueColors = (changedColorMaps: EditorColorMap[]) => {
    updateAllUniqueColors(changedColorMaps);
    sendMessage({
      type: 'UpdateUniqueColors',
      data: { colorsMap: changedColorMaps, roomId: roomId as string },
    } as UpdateUniqueColors);
  };

  React.useEffect(() => {
    fetchLottie();
  }, [roomId]);

  return (
    <ErrorBoundary>
      <main className='flex h-[calc(100vh-65px)] w-full'>
        {isLottieLoaded && roomId ? (
          <>
            <LeftPanel
              setLayerVisibility={setLayerVisibility}
              onDeleteLayer={onDeleteLayer}
            />
            <EditorView />
            <RightPanel
              setColor={setColor}
              setSettings={setSettings}
              changeUniqueColors={changeUniqueColors}
              roomId={roomId as string}
            />
          </>
        ) : (
          <FullPageSpinner />
        )}
      </main>
    </ErrorBoundary>
  );
}
