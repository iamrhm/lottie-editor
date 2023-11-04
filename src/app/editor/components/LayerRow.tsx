import React from 'react';
import { RiDeleteBinLine, RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';

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
  const { layer, path } = layerMap;
  const [isVisible, toggleVisibility] = React.useState(
    layerMap.layer.ks.o.k !== 0
  );
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
      className={`w-full cursor-pointer px-4 py-2 pl-6 ${
        isSelected ? 'bg-slate-100' : ''
      } ${isNested ? 'pr-0' : ''} ${isLastLayer ? 'pb-0' : ''}`}
      onClick={handleSelectLayer}
      onMouseEnter={() => toggleIsHovered(true)}
      onMouseLeave={() => toggleIsHovered(false)}
    >
      <div className='flex items-center justify-between'>
        <p className='text-sm text-neutral-800'>{layer.nm}</p>
        <div
          className={`flex items-center gap-2 text-sm ${
            isHovered || isSelected ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span
            className='cursor-pointer px-1 text-neutral-800 '
            onClick={handleVisibilityChange}
          >
            {isVisible ? <RiEyeLine /> : <RiEyeCloseLine />}
          </span>
          <span
            className='cursor-pointer px-1 text-neutral-800'
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
