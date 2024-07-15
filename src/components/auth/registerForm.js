import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./authInput";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  changeStatus,
  googleLogin,
  registerUser,
} from "../../features/userSlice";
import { useState } from "react";
import Picture from "./Picture";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function RegisterForm() {
  const cloud_name = process.env.REACT_APP_CLOUD_NAME;
  const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;
  const clientid = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [picture, setPicture] = useState();
  const [readablePicture, setReadablePicture] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    if (picture) {
      await uploadImage().then(async (response) => {
        console.log(response);
        let res = await dispatch(
          registerUser({ ...data, picture: response.secure_url })
        );
        if (res?.payload?.user) {
          navigate("/");
        }
      });
    } else {
      let res = await dispatch(registerUser({ ...data, picture: "" }));
      if (res?.payload?.user) {
        navigate("/");
      }
    }
  };

  const uploadImage = async () => {
    let formData = new FormData();
    formData.append("upload_preset", cloud_secret);
    formData.append("file", picture);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData
    );
    return data;
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
          <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
          <p className="mt-2 text-sm">Sign up</p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="name"
            label="Full Name"
            type="text"
            placeholder="Enter Your Name"
            register={register}
            error={errors?.name?.message}
          />
          <AuthInput
            name="email"
            label="Email Address"
            type="text"
            placeholder="Enter Your Email Address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="status"
            label="Status (Optional)"
            type="text"
            placeholder="Enter Your Status"
            register={register}
            error={errors?.status?.message}
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
          {/* Picture */}
          <Picture
            readablePicture={readablePicture}
            setPicture={setPicture}
            setReadablePicture={setReadablePicture}
          />
          <button
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-xl tracking-wide font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-100"
            type="submit"
          >
            {status == "loading" ? (
              <PulseLoader color="#fff" size={12} />
            ) : (
              "SignUp"
            )}
          </button>
        </form>
        {/* Signin link */}
        <p className="flex flex-col items-center justify-center text-center mt-10 text-md dark:text-dark_text_1">
          <span>Already have an account?</span>
          <Link
            to="/register"
            className="hover:underline cursor-pointer transition ease-in duration-300"
          >
            SignIn
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
