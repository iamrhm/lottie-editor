import React from 'react';
import { RgbaColor } from 'react-colorful';

import {
  convertLottieColorToRGB,
  convertRGBToLottieColor,
} from '../../../utils';

import ColorPicker from './ColorPicker';

function ColoredButton({
  colorMap,
  updateColor,
}: {
  colorMap: EditorColorMap;
  updateColor: (updatedColorMap: EditorColorMap) => void;
}): JSX.Element {
  const { r, g, b, a = 1 } = convertLottieColorToRGB(colorMap.color);
  const [showColorPicker, toggleColorPicker] = React.useState(false);

  const onColorChange = (newColor: RgbaColor) => {
    const updatedColorMap = colorMap;
    updatedColorMap.color = convertRGBToLottieColor(newColor);
    updateColor(updatedColorMap);
  };

  return (
    <div className='relative m-2'>
      <button
        className={`h-[20px] w-[20px] rounded-full border border-solid ${
          !showColorPicker ? 'border-slate-200' : 'border-2 border-emerald-400'
        } cursor-pointer`}
        onClick={() => toggleColorPicker((prevState) => !prevState)}
        style={{
          backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
        }}
      />
      {showColorPicker ? (
        <div className='absolute -left-[200px] top-[24px] z-50'>
          <ColorPicker
            color={{ r, g, b, a }}
            onColorChange={onColorChange}
            closeColorPicker={(): void => toggleColorPicker(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

export default ColoredButton;
