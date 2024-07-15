import { useRef, useState } from "react";
import { CloseIcon, ReturnIcon } from "../../../../svg";
import SearchUsers from "./SearchUsers";
import SearchUsersResults from "./searchUsersResults";
import { useDispatch, useSelector } from "react-redux";
import { createGroupConvo } from "../../../../features/chatSlice";
import axios from "axios";
import EmojiPickerApp from "../../../chat/inputs/EmojiPicker";

function CreateGroup({ setShow, showPicker, setShowPicker }) {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const { status } = useSelector((state) => state.chat);
  const [name, setName] = useState();
  const [description, setDescription] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [picture, setPicture] = useState(undefined);
  const [readablePicture, setReadablePicture] = useState(undefined);
  const [error, setError] = useState(undefined);
  const cloud_name = process.env.REACT_APP_CLOUD_NAME;
  const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;
  const dispatch = useDispatch();
  const inputRef = useRef();
  const descriptionref = useRef();
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
  const createGroupHandler = async () => {
    if (status !== "loading") {
      let grpPicture = process.env.DEFAULT_GROUP_PICTURE;
      if (picture) {
        let formData = new FormData();
        formData.append("upload_preset", cloud_secret);
        formData.append("file", picture);
        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          formData
        );
        grpPicture = data.secure_url;
      }
      let users = [];
      selectedUsers.forEach((user) => users.push(user._id));
      let values = {
        name,
        users,
        token,
        description,
        picture: grpPicture,
      };
      await dispatch(createGroupConvo(values));
      setShow(false);
    }
  };
  return (
    <>
      <div className="createGroupAnimation relative flex0030 h-full z-40">
        {/* Container */}
        <div className="mt-5">
          {/* return button */}
          <button className="btn w-6 h-6 border" onClick={() => setShow(false)}>
            <ReturnIcon className="dark:fill-white" />
          </button>
          {/* Name and desciption input and picture */}
          <div className="mt-4 flex flex-col items-center justify-between pl-2 space-y-8 pb-7  ">
            <div className="w-full">
              <div className=" flex flex-col items-center justify-center relative w-fit rounded-full mb-4">
                <div
                  className=" absolute bottom-[0.1px] right-0 cursor-pointer bg-green_1 rounded-full w-fit h-fit"
                  onClick={() => handleChangePic()}
                >
                  <CloseIcon className="fill-white w-4 h-4 rotate-45" />
                </div>
                <img
                  src={picture ? readablePicture : "/defaultGroupPicture.png"}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover"
                />
                <input
                  type="file"
                  ref={inputRef}
                  hidden
                  accept="image/png,image/jpg,image/jpeg,image/webp"
                  onChange={handleImage}
                />
              </div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className=" w-full bg-transparent border-b border-green_1 dark:text-dark_text_1 outline-none pl-3"
              />
            </div>
            <div className="w-full mb-5 flex">
              <div w-fit>
                <EmojiPickerApp
                  msg={description}
                  setMsg={setDescription}
                  textRef={descriptionref}
                  showPicker={showPicker}
                  setShowPicker={setShowPicker}
                />
              </div>
              <input
                ref={descriptionref}
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className=" w-full bg-transparent border-b border-green_1 dark:text-dark_text_1 outline-none pl-3"
              />
            </div>
          </div>
          {/* Search Users and show selected users */}
          <SearchUsers
            setSearchResults={setSearchResults}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            createGroupHandler={createGroupHandler}
          />
          {/* Displaying Results */}
          <SearchUsersResults
            searchResults={searchResults}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </div>
      </div>
    </>
  );
}

export default CreateGroup;
