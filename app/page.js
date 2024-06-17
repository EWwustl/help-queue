'use client'

import { useSession } from 'next-auth/react';
import AdminCourseManagement from './(components)/AdminCourseManagement';

export default function Home() {
  const { data: session } = useSession();

  const renderComponent = () => {
    switch (session?.user?.role) {
      case "admin":
        return (
          <AdminCourseManagement />
        );
      case "user":
        return <p>Placeholder for User Page</p>
      default:
        return null;
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-600 text-white">
      {!session &&
        <div className="text-center bg-slate-700 base-button">
          <span className="text-xl block">Please make sure to have a school email added to your github account before signing in!</span>
          <span className="text-xl block">By logging into this site you agree you are an authorized user and agree to use cookies on this site.</span>
        </div>
      }
      {renderComponent()}
    </main>
  );
}
