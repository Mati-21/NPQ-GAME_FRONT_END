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
        <label className="text-black font-semibold">{label}</label>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`${border} rounded px-3 py-2 bg-transparent outline-none ${placeholderColor} text-black placeholder:text-xs placeholder:text-gray-300`}
          {...rest}
          onChange={(e) => {
            cleanError?.(); // 🔥 clears redux error
            rest.onChange?.(e); // keeps RHF working
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
