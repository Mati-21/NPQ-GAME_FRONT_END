import { Link } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";

function RegisterForm() {
  return (
    <div className="min-w-md mt-10 bg-purple-secondary self-start p-6 shadow-xl rounded-xl">
      {/* container */}
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-semibold mt-2 text-white">
          Register
        </h1>
        <Input label="Name:" placeholder="Please Insert Your Name" />
        <Input label="Email:" placeholder="Please Insert Your Email" />
        <Input label="Username:" placeholder="Please Insert Your Username" />
        <div className="flex gap-2">
          <Input label="Password:" placeholder="Please Insert Your Name" />
          <Input
            label="Confirm Password:"
            placeholder="Please confirm Your Password"
          />
        </div>
        <Button label="Sign up" />
        <p className="text-white">
          Already have an account ?{" "}
          <Link to="/login" className="text-purple-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
