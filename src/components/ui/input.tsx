import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: React.ReactNode; // 支持 JSX 元素
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, suffix, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {prefix && (
          <span className="absolute left-3 flex items-center justify-center text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            prefix ? "pl-10" : "", // 左侧图标时增加内边距
            suffix ? "pr-10" : "", // 右侧图标时增加内边距
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 flex items-center justify-center text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input };