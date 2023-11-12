import { StateCreator, create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

import {
  _toggleLayerVisibility,
  _updateLottieColor,
  _isSamePath,
  _deleteLayer,
  _parseLottie,
  _updateAllUniqueColors,
} from '../../utils';
import toast from 'react-hot-toast';

export type EditorStore = EditorState & {
  loadLottie: (lottieFile: LottieJSON) => void;
  toggleLayerVisibility: (layerPath: number[]) => void;
  updateLottieColor: (updatedColorMap: EditorColorMap) => void;
  updateSettings: (settings: LottieSettings) => void;
  deleteLayer: (layerPath: number[]) => void;
  selectLayer: (layerPath: number[]) => void;
  updateAllUniqueColors: (colorMaps: EditorColorMap[]) => void;
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
        try {
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
        } catch (e) {
          console.error(e);
          toast('Failed to parse');
        }
      },

      toggleLayerVisibility: (layerPath: number[]) => {
        try {
          const state = get();
          const lottieFile = _toggleLayerVisibility(
            state.lottieFile!,
            layerPath
          );
          const layersMap = state.layersMap.map((layerMap) => {
            if (_isSamePath(layerMap.path, layerPath)) {
              layerMap.isVisible = !layerMap.isVisible;
            }
            return layerMap;
          });
          set({ lottieFile, layersMap });
        } catch (e) {
          console.error(e);
          toast('Failed to parse');
        }
      },

      updateLottieColor: (updatedColorMap: EditorColorMap) => {
        try {
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
        } catch (e) {
          console.error(e);
          toast('Failed to parse');
        }
      },

      updateSettings: (settings: LottieSettings) => {
        try {
          const state = get();
          const lottieFile = state.lottieFile;
          lottieFile!.fr = Math.round(settings.framerate);
          lottieFile!.w = settings.width;
          lottieFile!.h = settings.height;
          set({ lottieFile, settings });
        } catch (e) {
          console.error(e);
          toast('Failed to parse');
        }
      },

      deleteLayer: (layerPath: number[]) => {
        try {
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
        } catch (e) {
          console.error(e);
          toast('Failed to parse');
        }
      },

      selectLayer: (selectedLayer: number[]) => {
        set({ selectedLayer });
      },

      updateAllUniqueColors: (changedColorMaps: EditorColorMap[]) => {
        try {
          const state = get();
          const lottieFile = _updateAllUniqueColors(
            state.lottieFile!,
            changedColorMaps
          );
          const { colorsMap } = _parseLottie(lottieFile);
          set({ lottieFile, colorsMap });
        } catch (e) {
          console.error(e);
          toast('Failed to parse');
        }
      },
    }),
    {
      name: 'editor',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditorStore;
