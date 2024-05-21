import LoginForm from "../components/auth/loginForm.js"

export default function Login(){
    return (
        <>
        <div className="h-screen dark:bg-dark_bg_1 items-center justify-center py-[19x] overflow-hidden">
            
         {/* Container    */}
            <div className="flex w-[1600px] mx-auto h-full">
            <LoginForm/>
            </div>
            
        </div>
        </>
    )
}