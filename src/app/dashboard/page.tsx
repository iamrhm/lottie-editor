import FrequentlyUsed from './sections/FrequentlyUsed';
import PublicAnimation from './sections/PublicAnimation';

export default function Home() {
  return (
    <main className='w-full bg-gray-100'>
      <div className='m-0 ml-auto mr-auto flex w-full flex-col items-start px-12'>
        <div className='flex w-full items-center py-6'>
          <h1 className='text-left text-2xl font-semibold text-gray-900'>
            Dashboard
          </h1>
        </div>
        <div className='w-full pb-6'>
          <FrequentlyUsed />
          <PublicAnimation />
        </div>
      </div>
    </main>
  );
}
