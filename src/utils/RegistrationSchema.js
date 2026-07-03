import * as yup from "yup";

export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .matches(/^[a-zA-Z\s-]+$/, "First name should only contain letters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .matches(/^[a-zA-Z\s-]+$/, "Last name should only contain letters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});
