import React from 'react';

interface IProps {
  updateSettings: (newSettings: LottieSettings) => void;
  settings: LottieSettings;
}

function SettingsTab({ updateSettings, settings }: IProps) {
  const [duration, setDuration] = React.useState<number>(
    Math.round((settings.lastframe - settings.firstframe) / settings.framerate)
  );
  const [framerate, setFramerate] = React.useState<number>(settings.framerate);

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
      e.target.id === 'framerate'
        ? setFramerate(ipValue as number)
        : setDuration(ipValue as number);
    }
  };

  const changeSettings = () => {
    const newFramerate =
      framerate !== settings.framerate
        ? framerate
        : Math.round((settings.lastframe - settings.firstframe) / duration);
    const newDuration = Math.round(
      (settings.lastframe - settings.firstframe) / newFramerate
    );

    setDuration(newDuration);
    setFramerate(newFramerate);

    const newSettings = {
      ...settings,
      firstframe: settings.firstframe,
      lastframe: settings.lastframe,
      framerate: newFramerate,
    };

    updateSettings(newSettings);
  };

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
        className='w-full rounded bg-neutral-200 px-3 py-2 text-white'
        onClick={changeSettings}
      >
        Update
      </button>
    </div>
  );
}

export default SettingsTab;
