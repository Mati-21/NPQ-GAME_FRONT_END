import { forwardRef } from "react";

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
    return (
      <div className="w-full flex flex-col gap-1">
        <label className="text-black dark:text-slate-200 font-semibold">{label}</label>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`${border} dark:border-slate-600 rounded px-3 py-2 bg-transparent dark:bg-slate-700 outline-none ${placeholderColor} text-black dark:text-slate-100 placeholder:text-xs placeholder:text-gray-300 dark:placeholder:text-slate-500`}
          {...rest}
          onChange={(e) => {
            cleanError?.();
            rest.onChange?.(e);
          }}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  },
);

// Add display name for better debugging
Input.displayName = "Input";

export default Input;
