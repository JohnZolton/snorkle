import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Patense Local",
  description: "100% Local AI Reference Analysis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          attribute="class"
        >
          <main className="flex min-h-screen flex-col items-center">
            <NavBar />

            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { NavBar } from "./_components/navbar";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
