import React from 'react';
import { RgbaColorPicker, RgbaColor } from 'react-colorful';

interface IProps {
  color: RgbaColor;
  onColorChange: (newcolor: RgbaColor) => void;
}

function ColorPicker({ color, onColorChange }: IProps): JSX.Element {
  const debounceRef = React.useRef<number>();

  const handleColorChange = (newcolor: RgbaColor) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(
      (newcolor: RgbaColor) => onColorChange(newcolor),
      500,
      newcolor
    );
  };

  return (
    <div className='rounded-lg border border-solid border-slate-200 bg-white p-2 shadow-md'>
      <RgbaColorPicker color={color} onChange={handleColorChange} />
    </div>
  );
}

export default ColorPicker;
