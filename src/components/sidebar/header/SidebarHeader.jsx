import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from "../../../svg";
import Menu from "./Menu";
import CreateGroup from "./groupChats/CreateGroup";
import Profile from "./Profile";
function SidebarHeader({ showMenu, setShowMenu, showPicker, setShowPicker }) {
  const { user } = useSelector((state) => state.user);

  const [show, setShow] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  return (
    <>
      <div className="min-h-[50px] dark:bg-dark_bg_2 flex items-center px-[16px] sidebar">
        {/* container */}
        <div className="w-full flex items-center justify-between">
          {/* user image */}
          <button
            className="btn flex justify-center items-center"
            onClick={() => setShowProfile(true)}
          >
            <img
              src={user.picture}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </button>
          {/* User icons */}
          <ul className="flex items-center gap-x-2 5">
            <li>
              <button className="btn">
                <CommunityIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li>
              <button className="btn">
                <StoryIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li>
              <button className="btn">
                <ChatIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li className="relative">
              <button
                className={`btn ${showMenu ? "bg-dark_hover_1" : ""}`}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <DotsIcon className="dark:fill-dark_svg_1" />
              </button>
              {showMenu ? (
                <Menu setShow={setShow} setShowMenu={setShowMenu} />
              ) : null}
            </li>
          </ul>
        </div>
      </div>
      <div>
        {/* Create Group */}
        {show ? (
          <CreateGroup
            setShow={setShow}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
          />
        ) : null}{" "}
        {/* Profile of user */}
        {showProfile ? (
          <div className="mt-2">
            <Profile setShowProfile={setShowProfile} />
          </div>
        ) : null}
      </div>
    </>
  );
}

export default SidebarHeader;
