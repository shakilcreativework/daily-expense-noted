import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 mt-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} DailyExpense Noted. Full-Stack Next.js Application.
        </p>
        <p className="flex items-center gap-1">
          Built with <Heart size={13} className="text-rose-500 fill-rose-500" /> using Next.js 16, TypeScript, Redux Toolkit & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

export default Footer;
