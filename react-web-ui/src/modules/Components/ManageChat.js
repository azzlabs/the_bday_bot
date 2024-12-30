import React, { useEffect, useState } from "react";
import LoadingSpinner from "./UI/LoadingSpinner";
import { FaArrowLeft, FaExchangeAlt, FaRegTrashAlt, FaRegUser, FaTrash } from "react-icons/fa";
import Button from "./UI/Button";
import Modal from "./UI/Modal";
import { base64toBlob, http } from "../../utils/Utils";

const prettyDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric' };

  if (date.getFullYear() != '1804') {
    options.year = 'numeric';
  }

  return date.toLocaleDateString("en-EN", options)
}

const UserImage = ({ user_id }) => {
  const [userImg, setUserImg] = useState(null);

  const fetchImage = async () => {
    const req = await http({ method: 'POST', url: 'api/getUserPhoto', form: { user_id } });

    if (req?.success) {
      setUserImg(await base64toBlob(req?.file));
    }
  };

  useEffect(() => {
    fetchImage();
  }, [user_id]);

  return userImg ?
    <img className="w-full rounded-full shadow-sm object-cover" src={userImg} /> :
    <div className="w-full aspect-square rounded-full text-sky-800 flex items-center justify-center bg-sky-50 text-xs"><FaRegUser /></div>;
}

const ManageChat = ({ chat, backFn }) => {
  const [birthdays, setBirthdays] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchBirthdays = async () => {
    setBirthdays(null);
    const req = await http({ method: 'POST', url: 'api/getBirthdays', form: { chat_id: chat.id } });

    if (req?.success) {
      setBirthdays(req?.found);
    } else {
      setMessage(req?.error);
    }
  };

  const deleteBirthday = async (birthday_id) => {
    await http({ method: 'POST', url: 'api/deleteBirthday', form: { birthday_id } });
    fetchBirthdays();
    setConfirmDelete(null);
  };

  useEffect(() => {
    fetchBirthdays();
  }, [chat.id]);

  return <>
    <div className="flex items-center mb-4 pb-0.5 border-b border-b-gray-200">
      <span className="flex-1 font-semibold text-md">
        Now managing group {chat.title}
      </span>
      <div>
        <Button btnStyle="link" onClick={backFn}>Change <FaExchangeAlt className="text-sm inline-block" /></Button>
      </div>
    </div>

    {birthdays === null ?
      <div className="flex justify-center">
        <LoadingSpinner className="w-8" />
      </div>
      : birthdays.length === 0 ?
        <>
          <p className="text-sm">
            No birthdays found. You can make your group members add their one using <code className="text-red-500 text-xs">/add_my_birthday</code> command in your group</p>
          <div className="text-center mt-3"><Button onClick={fetchGroups}>Retry <FaRedo className="text-sm inline-block" /></Button></div>
        </> :
        <ul className="flex flex-col gap-y-3">
          {birthdays.map((birthday) =>
            <li className="flex">
              <div className="w-8 mr-3 mt-1"><UserImage user_id={birthday?.user_id} /></div>
              <div className="flex-1">
                <div className="font-semibold">{birthday?.username || birthday?.first_name}</div>
                <div className="text-xs text-gray-600">{prettyDate(birthday?.bday) || <em>date error</em>}</div>
              </div>
              <div className="text-center mt-2">
                <Button onClick={() => setConfirmDelete(birthday)} btnStyle="danger"> <FaRegTrashAlt className="text-sm inline-block" /></Button>
              </div>
            </li>
          )}
        </ul>}

    <Modal 
      headerChildren="Are you sure?"
      isVisible={confirmDelete} 
      size="xs"
      onClose={() => setConfirmDelete(null)}
    >
      <div className="mb-2">You are about to delete <strong>{confirmDelete?.username || confirmDelete?.first_name}</strong>'s birthday. Confirm?</div>
      <div className="flex gap-2">
        <Button btnStyle="secondary" onClick={() => setConfirmDelete(null)}><FaArrowLeft className="text-sm inline-block" /> Back</Button>
        <Button btnStyle="danger" onClick={() => deleteBirthday(confirmDelete._id)}>Delete <FaRegTrashAlt className="text-sm inline-block" /></Button>
      </div>
    </Modal>
  </>
}

export default ManageChat;