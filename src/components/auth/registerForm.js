import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./authInput";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../features/userSlice";
export default function RegisterForm(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {status,error}=useSelector((state)=>state.user);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signUpSchema),
    })
    
    const onSubmit =async(data) => {
        let res=await dispatch(registerUser({...data,picture:""}));
        console.log(res);
        if (res?.payload?.user) {
            navigate("/");
          }   
    }; 
return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
    <div className="max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
    <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
    <p className="mt-2 text-sm">Sign up</p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <AuthInput name="name" label="Full Name" type="text" placeholder="Enter Your Name" register={register} error={errors?.name?.message}/>
        <AuthInput name="email" label="Email Address" type="text" placeholder="Enter Your Email Address" register={register} error={errors?.email?.message}/>
        <AuthInput name="status" label="Status (Optional)" type="text" placeholder="Enter Your Status" register={register} error={errors?.status?.message}/>
        <AuthInput name="password" label="Password" type="password" placeholder="Enter Your Password" register={register} error={errors?.password?.message}/>
       {/* IF ERROR EXISTS */}
        {error ? <div>
            <p className="text-red-400">{error} </p>
        </div> : null}
        <button className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-xl tracking-wide font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-100" type="submit">
        {status=="loading" ? <PulseLoader color="#fff" size={12} />:"SignIn" }
        </button>
        </form>
        {/* Signin link */}
        <p className="flex flex-col items-center justify-center text-center mt-10 text-md dark:text-dark_text_1">
            <span>Already have an account?</span>
            <Link href="/login" className="hover:underline cursor-pointer transition ease-in duration-300">SignUp</Link>
        </p>
    </div>
    </div>
);
} 