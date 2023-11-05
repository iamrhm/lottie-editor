import { StateCreator, create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

import {
  _toggleLayerVisibility,
  _updateLottieColor,
  _isSamePath,
  _deleteLayer,
  _parseLottie,
} from '../../utils';

export type EditorStore = EditorState & {
  loadLottie: (lottieFile: LottieJSON) => void;
  toggleLayerVisibility: (layerPath: number[]) => void;
  updateLottieColor: (updatedColorMap: EditorColorMap) => void;
  updateSettings: (settings: LottieSettings) => void;
  deleteLayer: (layerPath: number[]) => void;
  selectLayer: (layerPath: number[]) => void;
};

type EditorPersist = (
  config: StateCreator<EditorStore>,
  options: PersistOptions<EditorStore>
) => StateCreator<EditorStore>;

const { lottieFile, layersMap, colorsMap, settings }: EditorState = {
  lottieFile: null,
  layersMap: [],
  colorsMap: [],
  settings: null,
  selectedLayer: [],
};

const useEditorStore = create<EditorStore>(
  (persist as EditorPersist)(
    (set, get): EditorStore => ({
      lottieFile,
      layersMap,
      colorsMap,
      settings,
      selectedLayer: [],

      loadLottie: (lottieFile: LottieJSON) => {
        const { layersMap, colorsMap } = _parseLottie(lottieFile);
        const settings = {
          width: lottieFile.w,
          height: lottieFile.h,
          framerate: Math.round(lottieFile.fr),
          firstframe: lottieFile.ip,
          lastframe: lottieFile.op,
        };
        set({
          lottieFile,
          layersMap,
          colorsMap,
          settings,
          selectedLayer: [],
        });
      },

      toggleLayerVisibility: (layerPath: number[]) => {
        const state = get();
        const lottieFile = _toggleLayerVisibility(state.lottieFile!, layerPath);
        const layersMap = state.layersMap.map((layerMap) => {
          if (_isSamePath(layerMap.path, layerPath)) {
            layerMap.isVisible = !layerMap.isVisible;
          }
          return layerMap;
        });
        set({ lottieFile, layersMap });
      },

      updateLottieColor: (updatedColorMap: EditorColorMap) => {
        const state = get();
        const lottieFile = _updateLottieColor(
          state.lottieFile!,
          updatedColorMap
        );
        const colorsMap = state.colorsMap.map((colorMap) => {
          const combinedQueryPath = [
            ...colorMap.layerPath,
            ...(colorMap.shapePath || []),
          ];
          const combinedSourcePath = [
            ...updatedColorMap.layerPath,
            ...(updatedColorMap.shapePath || []),
          ];
          if (_isSamePath(combinedQueryPath, combinedSourcePath)) {
            return updatedColorMap;
          }
          return colorMap;
        });
        set({ lottieFile, colorsMap });
      },

      updateSettings: (settings: LottieSettings) => {
        const state = get();
        const lottieFile = state.lottieFile;

        lottieFile!.fr = Math.round(settings.framerate);
        lottieFile!.w = settings.width;
        lottieFile!.h = settings.height;

        set({ lottieFile, settings });
      },

      deleteLayer: (layerPath: number[]) => {
        const state = get();
        const lottieFile = _deleteLayer(state.lottieFile!, layerPath);
        const layersMap = state.layersMap.filter(
          (layerMap) => !_isSamePath(layerMap.path, layerPath)
        );
        const colorsMap = state.colorsMap.filter((colorMap) => {
          const combinedSourcePath = [
            ...colorMap.layerPath,
            ...(colorMap.shapePath || []),
          ];
          if (_isSamePath(layerPath, combinedSourcePath)) {
            return false;
          }
          return true;
        });
        set({ lottieFile, layersMap, colorsMap });
      },

      selectLayer: (selectedLayer: number[]) => {
        set({ selectedLayer });
      },
    }),
    {
      name: 'editor',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditorStore;
