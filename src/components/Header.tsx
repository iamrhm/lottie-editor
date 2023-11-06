import Link from 'next/link';

import LottieSession from './LottieSession';
import Save from './Save';

const Header = () => {
  return (
    <header className='flex items-center justify-between border border-b border-b-neutral-200 bg-white px-5 py-3'>
      <Link href='/'>
        <p className='cursor-pointer text-2xl font-bold'>Lottie Editor</p>
      </Link>
      <div className='flex items-center justify-between'>
        <LottieSession />
        <Save />
      </div>
    </header>
  );
};

export default Header;
