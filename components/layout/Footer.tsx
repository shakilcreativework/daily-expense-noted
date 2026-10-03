import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 sm:py-6 mt-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
        {/* Copyright notice */}
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} DailyExpense Noted. Full-Stack Next.js Application.
        </p>

        {/* Tech stack attribution with flex-wrap and center alignment on mobile */}
        <p className="flex flex-wrap items-center justify-center sm:justify-end gap-1 text-center sm:text-right">
          <span>Built with</span>
          <Heart size={13} className="text-rose-500 fill-rose-500 inline-block shrink-0" />
          <span>using Next.js 16, TypeScript, Redux & Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
