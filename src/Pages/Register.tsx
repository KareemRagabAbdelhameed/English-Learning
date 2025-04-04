import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import mymage from "../assets/register&login.png"
import {faEnvelope} from "@fortawesome/free-solid-svg-icons"
import {faLock,faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from "../validation"
import { Link } from "react-router-dom"
import axios from "axios";
import apiBaseUrl from "../config/axiosConfig"
import Swal from "sweetalert2"
import Cookies from "js-cookie";

const Register = () => {
  const [isLoading,setIsLoading] = useState(false);
  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(registerSchema)
  });
  const onSubmit = async(data: any) => {
    console.log(data);
        // 1-pending
    setIsLoading(true);

    try {
          // 2-fulfilled
      const response = await apiBaseUrl.post("/users/signup",data,{withCredentials : true});
      console.log(response);
      if(response.status===201){
        Swal.fire({
          title: "Success!",
            text: response.data.message, // Display the message from the backend
            icon: "info",
            confirmButtonText: "OK",
            confirmButtonColor: "#6D95EA",

        }).then((result) => {
          if(result.isConfirmed){
            window.location.href = "/login";
          }
        });
      }
          Cookies.set("userEmail",data.email,{expires : 7});
    } catch (error:unknown) {
          // 3-rejected
      if(axios.isAxiosError(error)){
        console.log(error.response);
        Swal.fire({
        icon: "error",
        title: "Failed to Create Account",
        text: error.response?.data.error,
        confirmButtonColor: "#6D95EA",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }
   
  // to make the passord visible or not visible
  const [isVisible, setIsVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="shadow-md dark:bg-gray-700 dark:text-white min-h-screen w-full max-w-screen-2xl   gap-3 bg-customBlue lg:flex md:flex">
      <div className="">
      <h1 className="lg:pl-16 lg:pt-8 pl-10 pt-5 text-white text-[40px] font-semibold h-12 text-center">Welcome To <span className="block lg:text-5xl lg:h-[72px] text-5xl text-center">Learn English</span></h1>\
      <img src={mymage} alt="" className="lg:mt-16 mt-10 mx-auto " />
      </div>
      <div className="shadow-md  dark:bg-gray-900 dark:text-white w-full max-w-[960px]  bg-white rounded-tl-[40px] rounded-tr-[40px] ml-auto lg:rounded-tl-[40px] lg:rounded-bl-[40px] lg:rounded-tr-none md:rounded-tr-none ">
        <h1 className="pt-10 font-bold lg:text-[40px] text-[30px] text-center mb-4">Create Account</h1>
        <form action="" className="w-4/5 mx-auto space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            <div className=" lg:flex  lg:space-x-3 lg:space-y-0 space-y-3">
            <div className="flex flex-1 flex-col ">
            <label htmlFor="username" className="font-medium">Username :</label>
            <input type="text" id="username" {...register("username")} className={`h-12 border-[1px] ${errors.username ? `border-red-500 focus:border-red-500` : `border-gray-600 focus:border-customBlue`} rounded-md pl-4 focus:outline-none focus:border-[2px]`} />
            <p className="block text-red-700 font-semibold text-sm">{errors.username?.message}</p>
            </div>
            
            </div>
            
            <div className="flex flex-col   space-y-1 relative">
                <label htmlFor="email"  className="font-medium">Email :</label>
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-10 w-5 h-5 dark:text-gray-900" />
                <input type="email" id="email" {...register("email")} className={`h-12 border-[1px] ${errors.email ? `border-red-500 focus:border-red-500` : `border-gray-600 focus:border-customBlue`} rounded-md pl-12 focus:outline-none focus:border-[2px]`}/>
                <p className="block text-red-700 font-semibold text-sm">{errors.email?.message}</p>
            </div>
            <div className=" lg:flex  lg:space-x-3 lg:space-y-0 space-y-3">
            <div className="flex flex-1 flex-col  space-y-1 relative">
            <label htmlFor="password" className="font-medium">Password :</label>
            <FontAwesomeIcon icon={faLock} className="absolute left-4 top-9 w-5 h-5 dark:text-gray-900" />
            <FontAwesomeIcon icon={isVisible?faEyeSlash :faEye} onClick={togglePasswordVisibility} className="absolute right-4 top-9 w-5 h-5 dark:text-gray-900" />
            <input type={isVisible? "text" : "password"} id="password" {...register("password")} className={`h-12 border-[1px] ${errors.password ? `border-red-500 focus:border-red-500` : `border-gray-600 focus:border-customBlue`} rounded-md pl-12 pr-12 focus:outline-none focus:border-[2px]`} />
            <p className="block text-red-700 font-semibold text-sm">{errors.password?.message}</p>
            </div>
            <div className="flex flex-1 flex-col  space-y-1 relative">
            <label htmlFor="confirm-password" className="font-medium">Confirm Password :</label>
            <FontAwesomeIcon icon={faLock} className="absolute left-4 top-9 w-5 h-5 cursor-pointer dark:text-gray-900" />
            <FontAwesomeIcon icon={isVisible?faEyeSlash :faEye} onClick={togglePasswordVisibility} className="absolute right-4 top-9 w-5 h-5 cursor-pointer dark:text-gray-900" />
            <input type={isVisible? "text" : "password"} id="confirm-password" {...register("confirmPassword")} className={`h-12 border-[1px] ${errors.confirmPassword ? `border-red-500 focus:border-red-500` : `border-gray-600 focus:border-customBlue`} rounded-md pl-12 pr-12 focus:outline-none focus:border-[2px]`} />
            <p className="block text-red-700 font-semibold text-sm">{errors.confirmPassword?.message}</p>
            </div>
            
            </div>
            <div>
            <button
                className={`bg-customBlue w-full rounded-md text-white font-medium mt-5 p-3 flex items-center justify-center 
                ${isLoading ? "opacity-50 cursor-not-allowed" : "opacity-100"}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                        Loading...
                    </>
                ) : (
                    "Create Account"
                )}
            </button>
            <h3 className="mt-2">Already have an an account? <Link className="text-customBlue font-medium cursor-pointer" to={"/login"}>Sign in</Link></h3>
        </div>
        </form>
        
      </div>
    </div>
  )
}

export default Register
