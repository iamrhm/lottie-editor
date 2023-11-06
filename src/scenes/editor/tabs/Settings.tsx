import React from 'react';

import useEditorStore, { EditorStore } from '@/store/useEditor';
import InputBox from '@/components/InputBox';

interface IProps {
  setSettings: (settings: LottieSettings) => void;
}

function SettingsTab({ setSettings }: IProps) {
  const { settings } = useEditorStore((state: EditorStore) => state);

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

  const changeSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFramerate = Math.round(calculateFramerate);
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
    setSettings(newSettings);
  };

  const isBtnDisabled =
    Math.round(
      (settings!.lastframe - settings!.firstframe) / settings!.framerate
    ) === duration && settings!.framerate === framerate;

  return (
    <form className='w-full px-4 py-4' onSubmit={changeSettings}>
      {/* <div className='flex items-center'>
        <InputBox label='width' disabled={true} value={`${settings?.width}`} />
        x
        <InputBox
          label='height'
          disabled={true}
          value={`${settings?.height}`}
        />
      </div> */}
      <InputBox
        label='Duration'
        type='number'
        max={20}
        min={1}
        value={duration}
        onChange={handleInputChange}
      />
      <InputBox
        label='Frame rate'
        type='number'
        max={999}
        min={1}
        value={framerate}
        onChange={handleInputChange}
      />
      <button
        className={`w-full rounded px-3 py-2 text-white ${
          isBtnDisabled ? 'bg-neutral-200' : 'bg-emerald-400'
        }`}
        disabled={isBtnDisabled}
        type='submit'
      >
        Update
      </button>
    </form>
  );
}

export default SettingsTab;
