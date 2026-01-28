import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "./Button";
import Input from "./Input";
import { registerSchema } from "../../../utils/RegistrationSchema";
import { useRegister } from "../../../hooks/useRegister";

function RegisterForm() {
  const { mutate } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data) => {
    console.log("Register Data:", data);
    // dispatch redux action or call API here
    mutate(data);
  };

  return (
    <div className="min-w-md mt-10 bg-white self-start p-6 shadow-all rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-bold mt-2 font-inter tracking-widest">
          Register
        </h1>

        {/* inputs */}

        <Input
          label="Name:"
          placeholder="Please Insert Your Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Email:"
          placeholder="Please Insert Your Email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Username:"
          placeholder="Please Insert Your Username"
          {...register("username")}
          error={errors.username?.message}
        />

        <div className="flex gap-2">
          <Input
            label="Password:"
            type="password"
            placeholder="Please Insert Your Password"
            {...register("password")}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password:"
            type="password"
            placeholder="Please confirm Your Password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button label="Sign up" type="submit" />

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-500 font-bold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
