import { useDispatch, useSelector } from "react-redux";
import { EditIcon, ReturnIcon } from "../../../svg";
import { useRef, useState } from "react";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { updateUserInfo } from "../../../features/userSlice";

function Profile({ setShowProfile }) {
  const cloud_name = process.env.REACT_APP_CLOUD_NAME;
  const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [initUser, setUser] = useState(user);
  const [picture, setPicture] = useState(undefined);
  const [readablePicture, setReadablePicture] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const dispatch = useDispatch();
  const handleImage = (e) => {
    let pic = e.target.files[0];
    if (!pic) {
      return;
    }
    if (
      pic.type !== "image/jpg" &&
      pic.type !== "image/jpeg" &&
      pic.type !== "image/png" &&
      pic.type !== "image/webp"
    ) {
      setError(`${pic.name} format is not supported`);
      return;
    } else if (pic.size > 1024 * 1024 * 7) {
      setError(`${pic.name} is too large, Max allowed size is 7 MB`);
      return;
    } else {
      setError("");
      setPicture(pic);
      // reading picture
      const reader = new FileReader();
      reader.readAsDataURL(pic);
      reader.onload = (e) => {
        setReadablePicture(e.target.result);
      };
    }
  };
  const handleChangePic = () => {
    setPicture("");
    setReadablePicture("");
    inputRef.current.click();
  };
  const handleupdateProfile = async () => {
    let updatedUser = { ...initUser };
    if (picture) {
      setLoading(true);
      let formData = new FormData();
      formData.append("upload_preset", cloud_secret);
      formData.append("file", picture);
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      );
      updatedUser = { ...updatedUser, picture: data.secure_url };
      setLoading(false);
    }

    const values = {
      token,
      user: {
        name: updatedUser.name,
        picture: updatedUser.picture,
        status: updatedUser.status,
        email: updatedUser.email,
      },
    };
    await dispatch(updateUserInfo(values));
    setShowProfile(false);
  };
  return (
    <div className="createGroupAnimation relative flex0030 h-full z-40">
      {/* Container */}
      <div className="mt-5 w-full flex items-center justify-between px-4">
        {/* return button */}
        <button
          className="btn w-6 h-6 border"
          onClick={() => setShowProfile(false)}
        >
          <ReturnIcon className="dark:fill-white" />
        </button>
        <h1 className="dark:text-green_1 text-[19px] mx-auto">
          Edit Your Profile
        </h1>
      </div>
      {/* Name input and picture */}
      <div className="mt-4 flex flex-col items-center justify-between pl-2 gap-y-7 ">
        <div className=" flex flex-col items-center justify-center relative">
          <div
            className=" absolute bottom-[-8px] right-[-3px] cursor-pointer bg-green_1 rounded-full w-7 h-7 flex items-center justify-center"
            onClick={() => handleChangePic()}
          >
            <EditIcon className="fill-white w-5 h-5" />
          </div>
          <img
            src={readablePicture ? readablePicture : initUser.picture}
            alt=""
            className="w-20 h-20 rounded-full object-cover"
          />
          <input
            type="file"
            ref={inputRef}
            hidden
            accept="image/png,image/jpg,image/jpeg,image/webp"
            onChange={handleImage}
          />
        </div>
        <div className="flex items-center justify-between px-5 w-full">
          <label
            htmlFor="name"
            className="mx-3 dark:text-green-600 text-[17px] p-2 w-fit font-bold"
          >
            Name&nbsp;&nbsp;:
          </label>
          <input
            id="name"
            type="text"
            value={initUser.name}
            onChange={(e) => {
              setUser({ ...initUser, name: e.target.value });
            }}
            className=" w-full bg-transparent border-b border-green_1 dark:text-gray-300 outline-none pl-3"
          />
        </div>
        <div className="flex items-center justify-between px-5 w-full">
          <label
            htmlFor="name"
            className="mx-3 dark:text-green-600 text-[17px] p-2 w-fit font-bold"
          >
            Email&nbsp;&nbsp;:
          </label>
          <input
            id="name"
            type="text"
            value={initUser.email}
            onChange={(e) => {
              setUser({ ...initUser, email: e.target.value });
            }}
            className=" w-full bg-transparent border-b border-green_1 dark:text-gray-300 outline-none pl-3"
          />
        </div>
        <div className="flex items-center justify-between px-5 w-full">
          <label
            htmlFor="name"
            className="mx-3 dark:text-green-600 text-[17px] p-2 w-fit font-bold"
          >
            Status&nbsp;&nbsp;:
          </label>
          <input
            id="name"
            type="text"
            value={initUser.status}
            onChange={(e) => {
              setUser({ ...initUser, status: e.target.value });
            }}
            className=" w-full bg-transparent border-b border-green_1 dark:text-gray-300 outline-none pl-3"
          />
        </div>
        {/* Errors */}
        {error !== "" ? (
          <div>
            <p className="mt-2 text-red-400">{error}</p>
          </div>
        ) : null}
        {/* Save Button */}
        <button className=" border-none w-60px bg-green_2 text-dark_text_4 text-lg px-3 py-2 rounded-xl mt-6">
          {loading ? (
            <span>
              <PulseLoader size={13} color="#fff" />
            </span>
          ) : (
            <span onClick={() => handleupdateProfile()}>Save Changes</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Profile;
