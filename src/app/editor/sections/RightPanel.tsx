import React from 'react';

import ColorTab from '../tabs/ColorTab';
import SettingsTab from '../tabs/SettingsTab';

interface IProps {
  settings: LottieSettings;
  selectedLayer: number[];
  colorsMap: EditorColorMap[];
  updateColor: (updatedColorMap: EditorColorMap) => void;
  updateSettings: (newSettings: LottieSettings) => void;
}

const tabs = [
  { label: 'Edit', key: 'edit' },
  { label: 'Settings', key: 'settings' },
  { label: 'Chat', key: 'chat' },
];

function RightPanel({
  colorsMap,
  settings,
  selectedLayer,
  updateColor,
  updateSettings,
}: IProps) {
  const [selectedTab, setSelectedTab] = React.useState<{
    label: string;
    key: string;
  }>(tabs[0]);

  const renderTabs = (): JSX.Element | null => {
    switch (selectedTab.key) {
      case 'edit':
        return (
          <ColorTab
            colorsMap={colorsMap}
            selectedLayer={selectedLayer}
            updateColor={updateColor}
          />
        );
      case 'settings':
        return (
          <SettingsTab settings={settings} updateSettings={updateSettings} />
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen w-[300px] flex-shrink-0 bg-white text-neutral-800'>
      <div className='flex w-full border-b border-solid border-b-neutral-200 pt-4 text-sm'>
        {tabs.map((tab) => (
          <div
            className={`cursor-pointer px-2 py-2 ${
              selectedTab.key === tab.key
                ? 'border-b-2 border-solid border-emerald-400'
                : ''
            } font-medium`}
            key={tab.key}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className='w-full'>{renderTabs()}</div>
    </div>
  );
}

export default RightPanel;
