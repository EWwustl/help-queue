'use client';

import { useSession } from 'next-auth/react';
import AdminCourseDashboard from './(components)/AdminCourseDashboard';
import UserCourseDashboard from './(components)/UserCourseDashboard';

export default function Home() {
  const { data: session } = useSession();

  const renderCourseDashboard = () => {
    switch (session?.user?.role) {
      case "admin":
        return <AdminCourseDashboard />;
      case "user":
        return <UserCourseDashboard userID={session.user.id} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-600 text-white">
      {!session &&
        <div className="text-center bg-slate-700 base-button">
          <span className="text-xl block">Please make sure to have your school email linked to your github account before signing in.</span>
          <span className="text-xl block">By logging into this site you agree you are an authorized user and agree to use sessions on this site.</span>
        </div>
      }

      {renderCourseDashboard()}
    </main>
  );
}
