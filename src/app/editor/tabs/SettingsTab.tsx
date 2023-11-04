import React from 'react';

import useEditorStore, { EditorStore } from '@/store/useEditor';

function SettingsTab() {
  const { settings, updateSettings } = useEditorStore(
    (state: EditorStore) => state
  );

  const [duration, setDuration] = React.useState<number>(
    Math.round(
      (settings!.lastframe - settings!.firstframe) / settings!.framerate
    )
  );
  const [framerate, setFramerate] = React.useState<number>(settings!.framerate);
  /* used for temporary calculation of framerate */
  const [calculateFramerate, setCalculateFramerate] = React.useState<number>(
    settings!.framerate
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(e.target.value)) {
      return;
    }
    let ipValue: string | number = e?.target?.value;
    if (e.target) {
      if (ipValue !== '' && !isNaN(Number(ipValue))) {
        ipValue = Number(ipValue);
      } else {
        ipValue = '';
      }
      if (e.target.id === 'framerate') {
        setFramerate(ipValue as number);
        setCalculateFramerate(
          Number(ipValue) > 0 ? Number(ipValue) : settings!.framerate
        );
      } else {
        setDuration(ipValue as number);
        const newFramerate =
          Number(ipValue) > 0
            ? Math.round(
                (settings!.lastframe - settings!.firstframe) / Number(ipValue)
              )
            : settings!.framerate;
        setCalculateFramerate(newFramerate);
      }
    }
  };

  const changeSettings = () => {
    const newFramerate = calculateFramerate;
    const newDuration = Math.round(
      (settings!.lastframe - settings!.firstframe) / newFramerate
    );
    setDuration(newDuration);
    setFramerate(newFramerate);
    const newSettings = {
      width: settings!.width,
      height: settings!.height,
      firstframe: settings!.firstframe,
      lastframe: settings!.lastframe,
      framerate: newFramerate,
    };
    updateSettings(newSettings);
  };

  const isBtnDisabled =
    Math.round(
      (settings!.lastframe - settings!.firstframe) / settings!.framerate
    ) === duration && settings!.framerate === framerate;

  return (
    <div className='w-full px-4 py-4'>
      <label className='mb-3 flex items-center' htmlFor='duration'>
        <span className='min-w-[100px] shrink-0 text-sm'>Duration</span>
        <input
          className='block w-16 rounded border border-solid border-neutral-200 bg-slate-100 p-1 outline-none'
          id='duration'
          type='number'
          max={20}
          min={1}
          value={duration}
          onChange={handleInputChange}
        />
      </label>
      <label className='mb-3 flex items-center' htmlFor='framerate'>
        <span className='min-w-[100px] shrink-0 text-sm'>Frame rate</span>
        <input
          id='framerate'
          className='block w-16 rounded border border-solid border-neutral-200 bg-slate-100 p-1 outline-none'
          type='number'
          max={999}
          min={1}
          value={framerate}
          onChange={handleInputChange}
        />
      </label>
      <button
        className={`w-full rounded px-3 py-2 text-white ${
          isBtnDisabled ? 'bg-neutral-200' : 'bg-emerald-400'
        }`}
        disabled={isBtnDisabled}
        onClick={changeSettings}
      >
        Update
      </button>
    </div>
  );
}

export default SettingsTab;
