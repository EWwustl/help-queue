import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/app/(components)/SessionWrapper";
import Nav from "./(components)/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Help Queue",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <div className="flex flex-col h-screen max-h-screen">
            <Nav />
            <div className="flex-grow overflow-y-auto">{children}</div>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
