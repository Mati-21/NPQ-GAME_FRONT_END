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
  const { mutate, isPending } = useLogin();
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
    <div className="w-full max-w-md mx-4 sm:mx-0 sm:min-w-md mt-8 sm:mt-10 bg-white dark:bg-slate-800 self-start p-6 shadow-all rounded-xl text-black dark:text-slate-100">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-semibold mt-2 text-black dark:text-white">
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

        <Button label={isPending ? "Signing in..." : "Sign in"} isLoading={isPending} type="submit" />

        {serverError && <p className="text-red-500 text-xs">{serverError}</p>}

        <p className="text-center dark:text-slate-300">
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
