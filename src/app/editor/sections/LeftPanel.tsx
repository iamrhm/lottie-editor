'use client';
import React from 'react';

import useEditorStore, { EditorStore } from '@/store/useEditor';

import LayerRow from '../components/LayerRow';
import LayerAccordion from '../components/LayerAccordion';

function LeftPanel() {
  const {
    layersMap,
    selectedLayer,
    toggleLayerVisibility,
    deleteLayer,
    selectLayer,
  } = useEditorStore((state: EditorStore) => state);

  const toggleVisibility = (layerPath: number[]): void => {
    toggleLayerVisibility(layerPath);
    return;
  };

  const handleDelete = (layerPath: number[]): void => {
    deleteLayer(layerPath);
    return;
  };

  return (
    <div className='w-[250px] flex-shrink-0  bg-white pt-6'>
      <ul className='w-full'>
        {layersMap
          .filter((l) => !l?.isChild)
          .map((layerMap) => {
            if (layerMap.refId) {
              const nestedLayers = layersMap.filter(
                (childLayerMap) =>
                  childLayerMap.isChild &&
                  childLayerMap.assetId === layerMap.refId
              );
              return (
                <LayerAccordion
                  key={layerMap.ind}
                  layerMap={layerMap}
                  nestedLayers={nestedLayers}
                  selectedLayer={selectedLayer}
                  selectLayer={selectLayer}
                  toggleLayerVisibility={toggleVisibility}
                  deleteLayer={handleDelete}
                />
              );
            } else {
              return (
                <LayerRow
                  key={layerMap.ind}
                  layerMap={layerMap}
                  selectedLayer={selectedLayer}
                  selectLayer={selectLayer}
                  toggleLayerVisibility={toggleVisibility}
                  deleteLayer={handleDelete}
                />
              );
            }
          })}
      </ul>
    </div>
  );
}

export default LeftPanel;
