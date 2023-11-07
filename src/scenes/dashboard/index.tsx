import FrequentlyUsed from './sections/FrequentlyUsed';
import PublicAnimation from './sections/PublicAnimation';
import SidePanel from './sections/SidePanel';
import RecentModified from './sections/RecentModified';

export default function Dashboard() {
  return (
    <main className='h-[calc(100vh-58px)] w-full bg-gray-100'>
      <div className='m-0 ml-auto mr-auto flex w-full flex-col items-start'>
        <div className='flex w-full'>
          <SidePanel />
          <div className='h-[calc(100vh-58px)] w-full overflow-y-auto px-8 pb-6'>
            <div className='flex w-full items-center py-6'>
              <h1 className='text-left text-2xl font-semibold text-neutral-900'>
                Dashboard
              </h1>
            </div>
            <RecentModified />
            <FrequentlyUsed />
            <PublicAnimation />
          </div>
        </div>
      </div>
    </main>
  );
}
