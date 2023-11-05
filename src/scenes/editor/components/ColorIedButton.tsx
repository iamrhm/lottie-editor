import React from 'react';
import { RgbaColor } from 'react-colorful';

import {
  _convertLottieColorToRGB,
  _convertRGBToLottieColor,
} from '../../../../utils';

import ColorPicker from './ColorPicker';

function ColoredButton({
  colorMap,
  updateColor,
}: {
  colorMap: EditorColorMap;
  updateColor: (updatedColorMap: EditorColorMap) => void;
}): JSX.Element {
  const { r, g, b, a = 1 } = _convertLottieColorToRGB(colorMap.color);
  const [showColorPicker, toggleColorPicker] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const onColorChange = (newColor: RgbaColor) => {
    const color = _convertRGBToLottieColor(newColor);
    updateColor({ ...colorMap, color });
  };

  const outsideClickHandler = (e: MouseEvent): void => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      toggleColorPicker(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('click', outsideClickHandler);
    return (): void => window.removeEventListener('click', outsideClickHandler);
  }, []);

  return (
    <div className='relative m-2' ref={ref}>
      <button
        className={`h-[20px] w-[20px] rounded-full border border-solid ${
          !showColorPicker ? 'border-slate-200' : 'border-2 border-emerald-400'
        } cursor-pointer`}
        onClick={(e) => {
          toggleColorPicker((prevState) => !prevState);
        }}
        style={{
          backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
        }}
      />
      {showColorPicker ? (
        <div className='absolute -left-[200px] top-[24px] z-50'>
          <ColorPicker color={{ r, g, b, a }} onColorChange={onColorChange} />
        </div>
      ) : null}
    </div>
  );
}

export default ColoredButton;
