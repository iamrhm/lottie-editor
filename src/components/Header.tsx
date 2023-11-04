import Link from 'next/link';

const Header = () => {
  return (
    <header className='flex items-center justify-between border-b border-solid border-b-neutral-200 bg-white px-12 py-4'>
      <Link href='/'>
        <p className='cursor-pointer text-2xl font-bold'>Lottie Editor</p>
      </Link>
    </header>
  );
};

export default Header;
