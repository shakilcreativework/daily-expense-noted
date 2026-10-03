import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[] | readonly string[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full appearance-none rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 transition-colors duration-150 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
                error
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
                disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800' : '',
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const text = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={value} value={value}>
                  {text}
                </option>
              );
            })}
          </select>

          <div className="absolute right-3 pointer-events-none text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-500 mt-0.5 animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
