import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to LegalChain</h1>
      <p className="mb-6">Please log in or sign up to continue:</p>
      <div className="space-x-4">
        <Link href="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
        </Link>
        <Link href="/signup">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
