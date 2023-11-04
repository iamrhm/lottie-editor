import React from 'react';

import ColoredButton from '../components/ColorIedButton';

interface IProps {
  colorsMap: EditorColorMap[];
  selectedLayer: number[];
  updateColor: (updatedColorMap: EditorColorMap) => void;
}

function ColorTab({ colorsMap, selectedLayer, updateColor }: IProps) {
  return (
    <div className='w-full flex-col'>
      <div className='w-full flex-col'>
        <div className='px-4 py-4 text-sm font-medium text-neutral-800'>
          All colors
        </div>
        <div className='item-center flex w-full flex-wrap px-4'>
          {colorsMap.map((colorMap, index) => (
            <ColoredButton
              key={index}
              colorMap={colorMap}
              updateColor={updateColor}
            />
          ))}
        </div>
      </div>
      {selectedLayer.length ? (
        <div className='w-full flex-col pt-4'>
          <div className='px-4 py-4 text-sm font-medium text-neutral-800'>
            Selected layer colors
          </div>
          <div className='item-center flex w-full flex-wrap px-4'>
            {colorsMap
              .filter((colorMap) =>
                selectedLayer.length === 1
                  ? selectedLayer[0] === colorMap.layerPath[0]
                  : colorMap.layerPath === selectedLayer
              )
              .map((colorMap, index) => (
                <ColoredButton
                  key={index}
                  colorMap={colorMap}
                  updateColor={updateColor}
                />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ColorTab;
