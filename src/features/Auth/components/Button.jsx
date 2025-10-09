function Button({ label }) {
  return (
    <button className="w-full flex items-center justify-center p-2 mt-4 cursor-pointer rounded-full bg-[#5959AF] font-semibold text-xl text-white">
      {label}
    </button>
  );
}

export default Button;
