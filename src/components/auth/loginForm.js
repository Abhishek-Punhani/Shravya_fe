import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../utils/validation";
import AuthInput from "./authInput";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { googleLogin, loginUser } from "../../features/userSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clientid = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const { status, error } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (values) => {
    let res = await dispatch(loginUser({ ...values }));

    if (res?.payload?.user) {
      navigate("/");
    }
  };
  const handleLogin = async (user) => {
    await dispatch(googleLogin(user));
  };
  return (
    <div className="w-full max-h-max flex items-center justify-center ">
      {/* Container */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-sm">Sign In</p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="email"
            label="Email Address"
            type="text"
            placeholder="Enter Your Email Address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter Your Password"
            register={register}
            error={errors?.password?.message}
          />
          {/* IF ERROR EXISTS */}
          {error ? (
            <div>
              <p className="text-red-400">{error} </p>
            </div>
          ) : null}

          <button
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-xl tracking-wide font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-100"
            type="submit"
          >
            {status == "loading" ? (
              <PulseLoader color="#fff" size={12} />
            ) : (
              "SignIn"
            )}
          </button>
        </form>
        {/* SignUp link */}
        <p className="flex flex-col items-center justify-center text-center mt-10 text-md dark:text-dark_text_1">
          <span>New to Shravya</span>
          <Link
            to="/register"
            className="hover:underline cursor-pointer transition ease-in duration-300"
          >
            SignUp
          </Link>
        </p>
        {/* Google login button */}
        <div className="w-full flex items-center justify-center">
          <GoogleOAuthProvider clientId={clientid}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                let decode = jwtDecode(credentialResponse.credential);
                let user = {
                  name: decode.name,
                  email: decode.email,
                  picture: decode.picture,
                  googleId: decode.sub.toString(),
                  password: decode.sub.toString() + "S@",
                };
                handleLogin(user);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}
