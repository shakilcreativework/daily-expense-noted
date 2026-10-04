import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-4 sm:py-5 mt-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-slate-500 dark:text-slate-400 text-center sm:text-left">
        {/* Copyright notice */}
        <p className="text-[11px] sm:text-[10.5px] md:text-xs sm:whitespace-nowrap">
          &copy; {new Date().getFullYear()} DailyExpense Noted. Full-Stack Next.js Application.
        </p>

        {/* Tech stack attribution */}
        <p className="flex items-center justify-center sm:justify-end gap-1 text-[11px] sm:text-[10.5px] md:text-xs sm:whitespace-nowrap">
          <span>Built with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 inline-block shrink-0" />
          <span>using Next.js 16, TypeScript, Redux & Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
