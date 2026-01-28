import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { useLogin } from "../../../hooks/useLogin";
import { setCredentials } from "../authSlice";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate, isLoading } = useLogin();
  // const { error } = useSelector((state) => state.auth); // Redux error (optional)

  // ✅ Use useState for server errors
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: (data) => {
        dispatch(setCredentials(data));
        navigate("/home", { replace: true });
      },
      onError: (err) => {
        // Save backend error in local state
        setServerError(err?.response?.data?.error?.message || "Login failed");
      },
    });
  };

  // ✅ Clear server error on typing
  const cleanError = () => {
    setServerError("");
  };

  return (
    <div className="min-w-md mt-10 bg-white self-start p-6 shadow-all rounded-xl text-black">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-semibold mt-2 text-black">
          Sign in
        </h1>

        <Input
          label="Email:"
          placeholder="Please Insert Your Email"
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
          cleanError={cleanError}
        />

        <Input
          label="Password:"
          type="password"
          placeholder="Please Insert Your Password"
          {...register("password", { required: "Password is required" })}
          error={errors.password?.message}
          cleanError={cleanError}
        />

        <Button label={isLoading ? "Signing in..." : "Sign in"} type="submit" />

        {serverError && <p className="text-red-500 text-xs">{serverError}</p>}

        <p className="text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-500 font-bold">
            Join us
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
