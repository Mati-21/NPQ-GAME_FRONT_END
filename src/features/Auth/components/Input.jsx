import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      placeholderColor = "placeholder-black",
      border = "border border-purple-600",
      error,
      cleanError,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="w-full flex flex-col gap-1">
        <label className="text-black dark:text-slate-200 font-semibold">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            className={`${border} dark:border-slate-600 rounded px-3 py-2 bg-transparent dark:bg-slate-700 outline-none ${placeholderColor} text-black dark:text-slate-100 placeholder:text-xs placeholder:text-gray-300 dark:placeholder:text-slate-500 w-full`}
            {...rest}
            onChange={(e) => {
              cleanError?.();
              rest.onChange?.(e);
            }}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  },
);

// Add display name for better debugging
Input.displayName = "Input";

export default Input;
