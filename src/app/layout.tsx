import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/components/web/auth-provider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planum",
};

export default function RootLayout(
  { children, }: Readonly<{ children: React.ReactNode }>,
) {
  return (
    <html
      lang="ru"
      className={cn("h-full", "antialiased", geistSans.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
            <AuthProvider>
              {children}
            </AuthProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
