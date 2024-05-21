import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./authInput";
export default function LoginForm(){
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signUpSchema),
    })
    
    const onSubmit = (data) => console.log(data);
    return  (
        <div className="h-screen w-full flex items-center justify-center overflow-hidden">
    {/* Container */}
    <div className="max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
    {/*Heading*/}
    <div className="text-center dark:text-dark_text_1">
        <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
        <p className="mt-2 text-sm">Sign in</p>
    </div>
    {/*Form*/}
    <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <AuthInput name="name" label="Full Name" type="text" placeholder="Enter Your Name" register={register} error={errors?.name?.message}/>
        <AuthInput name="email" label="Email Address" type="text" placeholder="Enter Your Email Address" register={register} error={errors?.email?.message}/>
        <AuthInput name="status" label="Status" type="text" placeholder="Enter Your Status" register={register} error={errors?.status?.message}/>
        <AuthInput name="password" label="Password" type="password" placeholder="Enter Your Password" register={register} error={errors?.password?.message}/>
        <button type="submit">Submit</button>
    </form>
    </div>
</div>
)
}