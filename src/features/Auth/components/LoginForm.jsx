import { Link } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";

function LoginForm() {
  return (
    <div className="min-w-md mt-10 bg-purple-secondary self-start p-6 shadow-xl rounded-xl">
      {/* container */}
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-semibold mt-2 text-white">
          Sign in
        </h1>

        <Input label="Email:" placeholder="Please Insert Your Email" />
        <Input label="Password:" placeholder="Please Insert Your Password" />
        <Button label="Sign up" />

        <p className="text-white">
          Don`t have an account ?{" "}
          <Link to="/register" className="text-purple-500">
            Join us
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
