import React from 'react';
import { PiCaretCircleRightDuotone } from 'react-icons/pi';

import useEditorStore, { EditorStore } from '@/store/useEditor';

import ColoredButton from '../components/ColorIedButton';
import { _convertLottieColorToRGB } from '../../../../utils';
import UniqueColors from '../components/UniqueColors';

interface IProps {
  setColor: (updatedColorMap: EditorColorMap) => void;
  changeUniqueColors: (changedColorMaps: EditorColorMap[]) => void;
}

function ColorTab({ setColor, changeUniqueColors }: IProps) {
  const { colorsMap, selectedLayer } = useEditorStore(
    (state: EditorStore) => state
  );
  const [showAllColor, toggleAllColor] = React.useState(false);

  const updateColor = (updatedColorMap: EditorColorMap): void => {
    setColor(updatedColorMap);
  };

  const updateUniqueColor = (
    color: EditorColorMap['color'],
    paths: Array<{
      layerPath: EditorColorMap['layerPath'];
      shapePath?: EditorColorMap['layerPath'];
    }>
  ): void => {
    const colorMaps: EditorColorMap[] = paths.map(
      (path): EditorColorMap => ({
        color,
        layerPath: path.layerPath,
        shapePath: path.shapePath,
      })
    );
    changeUniqueColors(colorMaps);
  };

  /**
   *  Uniqe color Array
   * {
   *  [color] = {
   * paths: [{layerPath: [], shapePath[]}],
   * color: number[]
   * }
   *
   */
  const uniqueColors = React.useMemo(
    () =>
      colorsMap.reduce(
        (acc, current) => {
          try {
            const colorStr = current.color.join('');
            if (typeof colorStr === 'object') throw Error;
            const currPaths = acc[colorStr]?.paths || [];
            acc[colorStr] = {
              paths: [
                ...currPaths,
                {
                  layerPath: current.layerPath,
                  shapePath: current.shapePath,
                },
              ],
              color: current.color,
            };
            return acc;
          } catch (e) {
            return acc;
          }
        },
        {} as Record<
          string,
          {
            paths: Array<{
              layerPath: EditorColorMap['layerPath'];
              shapePath?: EditorColorMap['layerPath'];
            }>;
            color: EditorColorMap['color'];
          }
        >
      ),
    [colorsMap]
  );

  return (
    <div className='w-full flex-col'>
      {/* All Color section */}
      <div className='w-full flex-col border-b border-b-neutral-100'>
        <div className='flex items-center justify-between gap-2 pr-4 text-sm text-neutral-700'>
          <p
            className={`px-4 py-4 text-sm font-medium text-neutral-800 ${
              showAllColor ? 'font-medium' : ''
            } `}
          >
            All colors
          </p>
          <span
            className={`cursor-pointer rounded-full p-1.5 text-sm hover:bg-slate-200 ${
              showAllColor ? 'rotate-90' : '-rotate-90'
            }`}
            onClick={() => toggleAllColor((prev) => !prev)}
          >
            <PiCaretCircleRightDuotone />
          </span>
        </div>
        {showAllColor ? (
          <div className='item-center flex w-full flex-wrap px-4 pb-2'>
            {colorsMap.map((colorMap, index) => (
              <ColoredButton
                key={index}
                colorMap={colorMap}
                updateColor={updateColor}
              />
            ))}
          </div>
        ) : null}
      </div>
      {/* Unique Color section */}
      <div className='w-full flex-col border-b border-b-neutral-100 pb-2'>
        <p className='px-4 py-4 text-sm font-medium text-neutral-800'>
          Unique colors
        </p>
        <div className='item-center flex w-full flex-wrap px-4'>
          {Object.keys(uniqueColors).map((key, index) => (
            <UniqueColors
              key={key}
              color={uniqueColors[key].color}
              paths={uniqueColors[key].paths}
              updateColor={updateUniqueColor}
            />
          ))}
        </div>
      </div>
      {/* Selected layer colors section */}
      {selectedLayer.length ? (
        <div className='w-full flex-col border-b border-b-neutral-100 pb-2'>
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
