'use client';
import React from 'react';

import useEditorStore, { EditorStore } from '@/store/useEditor';

import LayerRow from '../components/LayerRow';
import LayerAccordion from '../components/LayerAccordion';

interface IProps {
  setLayerVisibility: (layerPath: number[]) => void;
  onDeleteLayer: (layerPath: number[]) => void;
}

function LeftPanel({ setLayerVisibility, onDeleteLayer }: IProps) {
  const { layersMap, selectedLayer, selectLayer } = useEditorStore(
    (state: EditorStore) => state
  );

  const toggleVisibility = (layerPath: number[]): void => {
    setLayerVisibility(layerPath);
    return;
  };

  const handleDelete = (layerPath: number[]): void => {
    onDeleteLayer(layerPath);
    return;
  };

  return (
    <div className='h-full w-[250px] flex-shrink-0 bg-white px-2'>
      <ul className='h-full w-full overflow-y-auto'>
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
