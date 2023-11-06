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
      <div className='flex w-full border-b border-solid border-b-neutral-200 py-2 text-sm'>
        {Tabs.map((tab) => (
          <div
            className={`mx-2 cursor-pointer rounded bg-slate-100 px-4 py-1.5 font-medium ${
              selectedTab.key === tab.key ? 'bg-slate-300 font-semibold' : ''
            }`}
            key={tab.key}
            onClick={() => setSelectedTab(tab)}
          >
            <p
              className={`text-center ${
                selectedTab.key === tab.key ? 'font-semibold' : 'font-medium '
              }`}
            >
              {tab.label}
            </p>
          </div>
        ))}
      </div>
      <div className='w-full'>{renderTabs()}</div>
    </div>
  );
}

export default RightPanel;
