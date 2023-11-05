'use client';
import React from 'react';

import ColorTab from '../tabs/Color';
import SettingsTab from '../tabs/Settings';
import ChatTab from '../tabs/Chat';

const Tabs = [
  { label: 'Edit', key: 'edit' },
  { label: 'Settings', key: 'settings' },
  { label: 'Chat', key: 'chat' },
];

interface IProps {
  roomId: string;
  setColor: (updatedColorMap: EditorColorMap) => void;
  setSettings: (settings: LottieSettings) => void;
}

function RightPanel({ roomId, setColor, setSettings }: IProps) {
  const [selectedTab, setSelectedTab] = React.useState<{
    label: string;
    key: string;
  }>(Tabs[0]);

  const renderTabs = React.useCallback((): JSX.Element | null => {
    switch (selectedTab.key) {
      case 'edit':
        return <ColorTab setColor={setColor} />;
      case 'settings':
        return <SettingsTab setSettings={setSettings} />;
      case 'chat':
        return <ChatTab roomId={roomId} />;
      default:
        return null;
    }
  }, [selectedTab]);

  return (
    <div className='w-[300px] flex-shrink-0 bg-white text-neutral-800'>
      <div className='flex w-full border-b border-solid border-b-neutral-200 pt-4 text-sm'>
        {Tabs.map((tab) => (
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
