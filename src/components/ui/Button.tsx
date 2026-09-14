import { cn } from "@/utils/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bgPrimary focus-visible:ring-white disabled:opacity-50 disabled:pointer-events-none rounded-full",
          {
            "bg-white text-bgPrimary hover:bg-white/90": variant === "primary",
            "bg-bgSecondary text-white hover:bg-bgTertiary": variant === "secondary",
            "border border-white/20 bg-transparent text-white hover:bg-white hover:text-bgPrimary": variant === "outline",
            "bg-transparent text-white hover:bg-white/10": variant === "ghost",
            "bg-accent text-white hover:bg-orange-600": variant === "accent",
            "h-10 px-4 text-sm": size === "sm",
            "h-12 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
