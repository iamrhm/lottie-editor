import React from 'react';

import LayerRow from '../components/LayerRow';
import LayerAccordion from '../components/LayerAccordion';

interface IProps {
  layersMap: EditorLayerMap[];
  selectedLayer: number[];
  selectLayer: (layerPath: number[]) => void;
  toggleVisibility: (layerPath: number[]) => void;
  deleteLayer: (layerPath: number[]) => void;
}

function LeftPanel({
  layersMap,
  selectedLayer,
  selectLayer,
  toggleVisibility,
  deleteLayer,
}: IProps) {
  return (
    <div className='min-h-screen w-[250px] flex-shrink-0 bg-white pt-6'>
      <ul>
        {layersMap.map((layerMap) => {
          if (layerMap.assetLayer) {
            return (
              <LayerAccordion
                key={layerMap.layer.ind}
                layerMap={layerMap}
                selectedLayer={selectedLayer}
                selectLayer={selectLayer}
                toggleLayerVisibility={toggleVisibility}
                deleteLayer={deleteLayer}
              />
            );
          } else {
            return (
              <LayerRow
                key={layerMap.layer.ind}
                layerMap={layerMap}
                selectedLayer={selectedLayer}
                selectLayer={selectLayer}
                toggleLayerVisibility={toggleVisibility}
                deleteLayer={deleteLayer}
              />
            );
          }
        })}
      </ul>
    </div>
  );
}

export default LeftPanel;
