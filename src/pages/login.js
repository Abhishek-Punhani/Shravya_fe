import LoginForm from "../components/auth/loginForm.js";

export default function Login() {
  return (
    <>
      <div className="h-screen dark:bg-dark_bg_1 flex flex-col items-center justify-center py-[19x] overflow-hidden">
        {/* Container    */}
        <div className="flex w-[1600px] flex-col items-center justify-center mx-auto h-full">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
