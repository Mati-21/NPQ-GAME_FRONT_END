function Input({
  label,
  type,
  placeholder,
  border = "border border-purple-600",
}) {
  return (
    <div className="w-full flex flex-col gap-1 text-white">
      <label>{label}</label>
      <input
        type={type}
        className={`${border} rounded px-3 py-2 bg-transparent outline-none`}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Input;
