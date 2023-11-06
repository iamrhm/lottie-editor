import React from 'react';
import {
  RiDeleteBinLine,
  RiEyeLine,
  RiEyeCloseLine,
  RiShapeLine,
} from 'react-icons/ri';

interface IProps {
  layerMap: EditorLayerMap;
  selectedLayer?: number[];
  isNested?: boolean;
  isLastLayer?: boolean;
  selectLayer: (layerPath: number[]) => void;
  toggleLayerVisibility: (layerPath: number[]) => void;
  deleteLayer: (layerPath: number[]) => void;
}

function LayerRow({
  layerMap,
  selectedLayer,
  isNested,
  isLastLayer,
  selectLayer,
  toggleLayerVisibility,
  deleteLayer,
}: IProps): JSX.Element {
  const { layerName, path } = layerMap;
  const [isVisible, toggleVisibility] = React.useState(layerMap.isVisible);
  const [isHovered, toggleIsHovered] = React.useState(false);

  const isSelected = selectedLayer ? path === selectedLayer : false;

  const handleVisibilityChange = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleVisibility(!isVisible);
    toggleLayerVisibility(path);
  };

  const handleSelectLayer = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    selectLayer(path);
  };

  const handleDeleteLayer = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    deleteLayer(path);
  };

  return (
    <li
      className={`mt-2 w-full cursor-pointer rounded-md px-2 py-2  ${
        isSelected ? 'bg-slate-200' : isNested ? '' : 'hover:bg-slate-100'
      } ${isNested ? 'mt-0' : ''}`}
      onClick={handleSelectLayer}
      onMouseEnter={() => toggleIsHovered(true)}
      onMouseLeave={() => toggleIsHovered(false)}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2'>
          <span className='text-sm'>
            <RiShapeLine />
          </span>
          <p
            className={`text-sm text-neutral-700 ${
              isSelected ? 'font-medium' : ''
            } `}
          >
            {layerName}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 text-sm ${
            isHovered || isSelected ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span
            className='cursor-pointer px-1 text-neutral-600 '
            onClick={handleVisibilityChange}
          >
            {isVisible ? <RiEyeLine /> : <RiEyeCloseLine />}
          </span>
          <span
            className='cursor-pointer px-1 text-neutral-600'
            onClick={handleDeleteLayer}
          >
            <RiDeleteBinLine />
          </span>
        </div>
      </div>
    </li>
  );
}

export default LayerRow;
