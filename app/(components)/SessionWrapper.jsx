"use client";

import { SessionProvider } from "next-auth/react";

// must wrap children in a SessionProvider to use session
// a custom component is need here because the need to use client
export default function SessionWrapper({ children }) {
	return <SessionProvider>{children}</SessionProvider>;
}
