import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
};

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  let styles =
    "h-10 px-4 rounded-lg font-medium transition flex items-center gap-2";

  if (variant === "primary") {
    styles += " bg-slate-900 text-white hover:bg-slate-800";
  }

  if (variant === "secondary") {
    styles +=
      " border border-slate-300 bg-white text-slate-700 hover:bg-slate-100";
  }

  if (variant === "danger") {
    styles +=
      " bg-red-600 text-white hover:bg-red-700";
  }

  return (
    <button
      className={`${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;