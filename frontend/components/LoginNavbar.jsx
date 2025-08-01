import Link from 'next/link';

export default function LoginNavbar() {
  return (
    <nav className="absolute top-0 left-0 w-full p-6 z-10">
      <div className="container mx-auto">
        <Link href="/">
          <span className="text-3xl font-bold text-white hover:text-indigo-300 drop-shadow-md">
            WorkFlowX
          </span>
        </Link>
      </div>
    </nav>
  );
}
