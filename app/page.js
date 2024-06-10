'use client'

import { useSession } from 'next-auth/react';
import Courses from './(components)/Courses';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-600 text-white">
      {!session ? (
        <div className="text-center">
          <span className="text-2xl block">Please log in</span>
        </div>
      ) : (
        <div className="text-2xl block">
          <Courses />
        </div>
      )}
    </main>
  );
}
