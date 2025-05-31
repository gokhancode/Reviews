import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export function Page({ children, className }: PageProps) {
  return (
    <div className={cn('h-dvh w-full flex flex-col', className)}>
      {children}
    </div>
  );
}

interface MainProps {
  children: React.ReactNode;
  className?: string;
}

function Main({ children, className }: MainProps) {
  return (
    <main className={cn('flex-1 w-full', className)}>
      {children}
    </main>
  );
}

Page.Main = Main;
