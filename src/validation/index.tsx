import * as yup from "yup";
export const registerSchema = yup.object({
    firstName : yup.string().required("*First Name is Required"),
    lastName : yup.string().required("*Last Name is Required"),
    email : yup.string().required("*Email is Required").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Email not valid"),
    password: yup.string()
    .required("*Password is Required")
    .min(8, "*Password must be at least 8 characters long")
    .matches(/[a-z]/, "*Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "*Password must contain at least one uppercase letter")
    .matches(/\d/, "*Password must contain at least one number")
    .matches(/[@$!%*?&]/, "*Password must contain at least one special character (@, $, !, %, *, ?, &)"),
    confirmPassword: yup.string()
    .required("*Confirm Password is Required")
    .oneOf([yup.ref("password")], "*Passwords not match"),}).required();

export const loginSchema = yup.object({
    email : yup.string().required("*Email is Required").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Email not valid"),
    password: yup.string()
    .required("*Password is Required")
    .min(8, "*Password must be at least 8 characters long")
    .matches(/[a-z]/, "*Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "*Password must contain at least one uppercase letter")
    .matches(/\d/, "*Password must contain at least one number")
    .matches(/[@$!%*?&]/, "*Password must contain at least one special character (@, $, !, %, *, ?, &)"),
}).required();