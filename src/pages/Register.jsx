import RegisterForm from "../features/Auth/components/RegisterForm";

function Register() {
  return (
    <div className="flex-1 flex justify-center bg-[#f5f6f7] dark:bg-slate-900 transition-colors duration-300">
      {/* Register from comtainer */}
      <RegisterForm />
    </div>
  );
}

export default Register;
