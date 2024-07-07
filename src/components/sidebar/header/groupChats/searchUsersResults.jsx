function SearchUsersResults({
  searchResults,
  selectedUsers,
  setSelectedUsers,
  scale,
}) {
  const addUser = (contact) => {
    if (!selectedUsers.includes(contact)) {
      setSelectedUsers([...selectedUsers, contact]);
    }
  };
  searchResults = searchResults.filter((user) => !selectedUsers.includes(user));
  return (
    <>
      <div className="w-full convos scrollbar">
        <div>
          <ul>
            {searchResults &&
              searchResults.map((contact) => (
                <>
                  <li
                    className={`list-none h-[72px] hover:dark:bg-dark_bg_2 cursor-pointer dark:text-dark_text_1 px-[10px] ${
                      scale && "h-[45px] px-2"
                    }`}
                    onClick={() => addUser(contact)}
                    key={contact._id}
                  >
                    {/*Container*/}
                    <div
                      className={`flex items-center gap-x-3 py-[10px] ${
                        scale && "py-[5px]"
                      }`}
                    >
                      {/*Contact infos*/}
                      <div className="flex items-center gap-x-3">
                        {/*Conversation user picture*/}
                        <div
                          className={`relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden ${
                            scale && "max-w-[35px] min-w-[35px] h-[35px]"
                          }`}
                        >
                          <img
                            src={contact.picture}
                            alt={contact.name}
                            className="w-full h-full object-cover "
                          />
                        </div>
                        {/*Conversation name and message*/}
                        <div className="w-full flex flex-col">
                          {/*Conversation name*/}
                          <h1
                            className={`font-bold flex items-center gap-x-2 ${
                              scale && "text-[13px]"
                            }`}
                          >
                            {contact.name}
                          </h1>
                          {/* Conversation status */}
                          <div>
                            <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                              <div
                                className={`flex-1 items-center gap-x-1 dark:text-dark_text_2 ${
                                  scale && "text-xs"
                                }`}
                              >
                                <p>{contact.status}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*Border*/}
                    <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
                  </li>
                </>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default SearchUsersResults;
