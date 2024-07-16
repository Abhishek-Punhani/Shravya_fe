import { Logo } from "../../../svg";

function WelcomeHome() {
  return (
    <>
      <div className="hidden md:flex sm:hidden min-h-full w-full dark:bg-dark_bg_4  flex-col items-center justify-center  select-none border-l dark:border-l-dark_border_2 border-b-[6px] border-b-green_2">
        {/* container */}
        <div className="w-full flex flex-col  gap-y-8 items-center justify-center">
          <span className="flex items-center justify-center w-full">
            <Logo />
          </span>
          {/* Infos */}
          <div className="mt-1 text-center space-y-3">
            <h1 className="text-[32px] dark:text-dark_text_1 font-extralight">
              Shravya
            </h1>
            <p className="text-sm dark:text-dark_text_3">
              {" "}
              Connecting Conversations, Bridging Worlds <br /> Start a new
              conversation
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default WelcomeHome;
