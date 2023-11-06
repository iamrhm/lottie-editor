import React from 'react';

import useEditorStore, { EditorStore } from '@/store/useEditor';

import ColoredButton from '../components/ColorIedButton';

interface IProps {
  setColor: (updatedColorMap: EditorColorMap) => void;
}

function ColorTab({ setColor }: IProps) {
  const { colorsMap, selectedLayer } = useEditorStore(
    (state: EditorStore) => state
  );

  const updateColor = (updatedColorMap: EditorColorMap): void => {
    setColor(updatedColorMap);
  };

  return (
    <div className='w-full flex-col'>
      <div className='w-full flex-col'>
        <p className='px-4 py-4 text-sm font-medium text-neutral-800'>
          All colors
        </p>
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
          <p className='px-4 py-4 text-sm font-medium text-neutral-800'>
            Selected layer colors
          </p>
          <div className='item-center flex w-full flex-wrap px-4'>
            {colorsMap
              .filter((colorMap) =>
                selectedLayer.length === 1
                  ? selectedLayer[0] === colorMap.layerPath[0]
                  : colorMap.layerPath.join('') === selectedLayer.join('')
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
