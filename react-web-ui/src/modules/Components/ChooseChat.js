import React, { useContext, useEffect, useState } from "react";
import { WebUIContext } from "../BdayBotWebUI";
import Alert from "./UI/Alert";
import Button from "./UI/Button";
import LoadingSpinner from "./UI/LoadingSpinner";
import { FaSignOutAlt, FaRedo, FaArrowRight, FaRegPaperPlane } from "react-icons/fa";
import { base64toBlob, http } from "../../utils/Utils";
import ManageChat from "./ManageChat";

const ChatImage = ({ image_id }) => {
  const [chatImg, setChatImg] = useState(null);

  const fetchImage = async () => {
    const req = await http({ method: 'POST', url: 'api/getTelegraphFile', form: { file_id: image_id } });

    if (req?.success) {
      setChatImg(await base64toBlob(req?.file));
    }
  };

  useEffect(() => {
    fetchImage();
  }, [image_id]);

  return chatImg ? 
    <img className="w-full rounded-full shadow-sm object-cover" src={chatImg} /> : 
    <div className="w-full aspect-square rounded-full text-sky-800 flex items-center justify-center bg-sky-50 text-xs"><FaRegPaperPlane /></div>;
}

const ChooseChat = () => {
  const [chats, setChats] = useState(null);
  const [managedChat, setManagedChat] = useState(null);
  const { currentUser, setCurrentUser, setMessage } = useContext(WebUIContext);

  const fetchGroups = async () => {
    setChats(null);
    const req = await http({ method: 'POST', url: 'api/getChatList' }, currentUser.token);

    if (req?.success) {
      setChats(req?.found);
    } else {
      setMessage(req?.error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [currentUser]);

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
                  <div className="w-8 mr-3 mt-1">
                    <ChatImage image_id={group?.photo?.small_file_id} />
                  </div>
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