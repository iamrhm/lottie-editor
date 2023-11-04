'use client';
import React from 'react';

import {
  setupInitialLottie,
  toggleLayerVisibility,
  findAndUpdateColor,
} from '../../utils';

import LeftPanel from './sections/LeftPanel';
import RightPanel from './sections/RightPanel';
import EditorView from './sections/EditorView';

import defaultLottie from '../../data/default.json';

export default function Editor() {
  const [state, setState] = React.useState<EditorState>(
    setupInitialLottie(defaultLottie)
  );
  const [selectedLayer, setSelectedLayer] = React.useState<number[]>([]);
  const animationFrame = React.useRef<number>();

  const updateState = (newState: EditorState): void => {
    if (animationFrame.current) {
      window.cancelAnimationFrame(animationFrame.current);
    }
    animationFrame.current = window.requestAnimationFrame(() =>
      setState({
        lottieFile: newState.lottieFile,
        layersMap: newState.layersMap,
        colorsMap: newState.colorsMap,
        settings: { ...newState.settings },
      })
    );
  };

  const selectLayer = (layerPath: number[]): void => {
    setSelectedLayer(layerPath);
  };

  const toggleVisibility = (layerPath: number[]): void => {
    const updatedLottieFile = toggleLayerVisibility(
      state.lottieFile,
      layerPath
    );
    const newState = setupInitialLottie(updatedLottieFile);
    updateState(newState);
  };

  const updateColor = (updatedColorMap: EditorColorMap): void => {
    const updatedLottieFile = findAndUpdateColor(
      state.lottieFile,
      updatedColorMap
    );
    const newState = setupInitialLottie(updatedLottieFile);
    updateState(newState);
  };

  const updateSettings = (newSettings: LottieSettings): void => {
    const updatedLottieFile = state.lottieFile;

    updatedLottieFile.fr = newSettings.framerate;
    updatedLottieFile.w = newSettings.width;
    updatedLottieFile.h = newSettings.height;

    const newState = setupInitialLottie(updatedLottieFile);
    updateState(newState);
  };

  const deleteLayer = (layerPath: number[]): void => {
    console.log(layerPath);
  };

  React.useEffect(() => {
    return () => {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <main className='flex min-h-screen'>
      <LeftPanel
        layersMap={state.layersMap}
        selectedLayer={selectedLayer}
        selectLayer={selectLayer}
        toggleVisibility={toggleVisibility}
        deleteLayer={deleteLayer}
      />
      <EditorView lottieFile={JSON.stringify(state.lottieFile)} />
      <RightPanel
        colorsMap={state.colorsMap}
        settings={state.settings}
        selectedLayer={selectedLayer}
        updateColor={updateColor}
        updateSettings={updateSettings}
      />
    </main>
  );
}
