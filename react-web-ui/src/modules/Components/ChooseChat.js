import React, { useContext, useEffect, useState } from "react";
import { WebUIContext } from "../BdayBotWebUI";
import Alert from "./UI/Alert";
import Button from "./UI/Button";
import LoadingSpinner from "./UI/LoadingSpinner";
import { FaSignOutAlt, FaRedo, FaArrowRight } from "react-icons/fa";
import { http } from "../../utils/Utils";
import ManageChat from "./ManageChat";

const ChooseChat = () => {
  const [chats, setChats] = useState(null);
  const [managedChat, setManagedChat] = useState(null);
  const { currentUser, setCurrentUser, setMessage } = useContext(WebUIContext);

  const fetchGroups = async () => {
    setChats(null);
    const req = await http({ method: 'POST', url: 'api/getChatList' });

    if (req?.success) {
      setChats(req?.found);
    } else {
      setMessage(req?.error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [currentUser])

  return <>
    <Alert className="mb-4">
      {currentUser?.photo_url ?
        <div className="w-8 mr-3"><img className="w-full rounded-full border border-sky-700" src={currentUser?.photo_url} /></div>
        : null}
      <div className="flex-1 font-semibold">Logged in as {currentUser?.username || currentUser?.first_name}</div>
      <button className="hover:opacity-60" onClick={() => setCurrentUser(null)} title="Logout">
        <FaSignOutAlt />
      </button>
    </Alert>

    {managedChat ?
      <ManageChat chat={managedChat} backFn={() => setManagedChat(null)} /> :
      <div className="flex flex-col">
        {chats === null ?
          <div className="flex justify-center">
            <LoadingSpinner className="w-8" />
          </div> :
          chats.length === 0 ?
            <>
              <p className="text-sm">
                No active groups found. To add one, launch the <code className="text-red-500 text-xs">/webregister</code> command in a group you want to manage via this web UI</p>
              <div className="text-center mt-3"><Button onClick={fetchGroups}>Retry <FaRedo className="text-sm inline-block" /></Button></div>
            </> :
            <ul className="flex flex-col gap-y-3">
              {chats.map(({ group }) =>
                <li className="flex">
                  <div className="w-8 mr-3 mt-1"><img className="w-full rounded-full shadow" src={currentUser?.photo_url} /></div>
                  <div className="flex-1">
                    <div className="font-semibold">{group?.title}</div>
                    <div className="text-xs text-gray-600">{group?.description || <em>No description</em>}</div>
                  </div>
                  <div className="text-center mt-2">
                    <Button onClick={() => setManagedChat(group)} btnStyle="secondary">Manage <FaArrowRight className="text-sm inline-block" /></Button>
                  </div>
                </li>
              )}
            </ul>
        }
      </div>
    }

  </>
}

export default ChooseChat;