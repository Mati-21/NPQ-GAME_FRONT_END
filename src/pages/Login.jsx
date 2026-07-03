import LoginForm from "../features/Auth/components/LoginForm";

function Login() {
  return (
    <div className="flex-1 flex justify-center bg-[#f5f6f7] dark:bg-slate-900 transition-colors duration-300">
      {/* Login from container */}
      <LoginForm />
    </div>
  );
}

export default Login;
