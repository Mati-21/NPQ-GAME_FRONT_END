function Button({ label, type = "button", ...rest }) {
  return (
    <button
      type={type}
      {...rest} // spreading all extra props here
      className="w-full flex items-center justify-center p-2 mt-4 cursor-pointer rounded-full bg-[#5959AF] font-semibold text-xl text-white"
    >
      {label}
    </button>
  );
}

export default Button;
