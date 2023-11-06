import React from 'react';
import { RiDeleteBinLine, RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';
import { PiCaretCircleRightDuotone } from 'react-icons/pi';

import LayerRow from './LayerRow';

interface IProps {
  nestedLayers: EditorLayerMap[];
  selectedLayer: number[];
  layerMap: EditorLayerMap;
  selectLayer: (layerPath: number[]) => void;
  toggleLayerVisibility: (layerPath: number[]) => void;
  deleteLayer: (layerPath: number[]) => void;
}

function LayerAccordion({
  nestedLayers,
  selectedLayer,
  layerMap,
  selectLayer,
  toggleLayerVisibility,
  deleteLayer,
}: IProps) {
  const { path, layerName } = layerMap;
  const [isExpanded, toggleExpand] = React.useState(false);
  const [isVisible, toggleVisibility] = React.useState(layerMap.isVisible);
  const [isHovered, toggleIsHovered] = React.useState(false);

  const isSelected = selectedLayer[0] === path[0];

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
    toggleExpand((prevState) => !prevState);
  };

  const handleDeleteLayer = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    deleteLayer(path);
  };

  return (
    <li
      className={`mt-2 w-full cursor-pointer rounded-md px-2 py-2 ${
        isSelected ? 'bg-slate-200' : 'hover:bg-slate-100'
      } `}
      onClick={handleSelectLayer}
      onMouseEnter={() => toggleIsHovered(true)}
      onMouseLeave={() => toggleIsHovered(false)}
    >
      <div
        className={`flex items-center justify-between ${
          isExpanded ? 'pb-2' : 'pb-0'
        }`}
      >
        <div className='flex items-center gap-2 text-sm text-neutral-700'>
          <span className={`text-sm ${isExpanded ? 'rotate-90' : ''}`}>
            <PiCaretCircleRightDuotone />
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
            className='cursor-pointer px-1 text-neutral-600'
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
      {isExpanded ? (
        <ul className='w-full'>
          {nestedLayers.map((childLayerMap, idx) => (
            <LayerRow
              key={childLayerMap.ind}
              layerMap={childLayerMap}
              selectLayer={selectLayer}
              toggleLayerVisibility={toggleLayerVisibility}
              deleteLayer={deleteLayer}
              isLastLayer={idx === nestedLayers.length - 1}
              isNested
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default LayerAccordion;
