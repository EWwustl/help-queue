"use client";

import { SessionProvider } from "next-auth/react";

// must wrap children in a SessionProvider to use session
export default function SessionWrapper({ children }) {
	return <SessionProvider>{children}</SessionProvider>;
}
