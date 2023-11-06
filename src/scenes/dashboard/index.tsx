import { RxDashboard } from 'react-icons/rx';

import FrequentlyUsed from './sections/FrequentlyUsed';
import PublicAnimation from './sections/PublicAnimation';

export default function Home() {
  return (
    <main className='h-[calc(100vh-65px)] w-full bg-gray-100'>
      <div className='m-0 ml-auto mr-auto flex w-full flex-col items-start'>
        <div className='flex w-full'>
          <div className='min-h-screen w-[250px] flex-shrink-0 border-r border-neutral-200 bg-white px-2 pt-4'>
            <div
              className={`mt-2 w-full cursor-pointer rounded-md bg-slate-200 px-2 py-2`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-sm'>
                    <RxDashboard />
                  </span>
                  <p className={`text-sm font-medium text-neutral-700`}>
                    Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full max-w-[1340px] px-8 pb-6'>
            <div className='flex w-full items-center py-6'>
              <h1 className='text-left text-2xl font-semibold text-neutral-900'>
                Dashboard
              </h1>
            </div>
            <FrequentlyUsed />
            <PublicAnimation />
          </div>
        </div>
      </div>
    </main>
  );
}
