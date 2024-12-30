import React, { useEffect, useState } from "react";
import LoadingSpinner from "./UI/LoadingSpinner";
import { FaExchangeAlt, FaTrash } from "react-icons/fa";
import Button from "./UI/Button";
import { http } from "../../utils/Utils";

const prettyDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric' };

  if (date.getFullYear() != '1804') {
    options.year = 'numeric';
  }

  return date.toLocaleDateString("en-EN", options)
}

const ManageChat = ({ chat, backFn }) => {
  const [birthdays, setBirthdays] = useState(null);

  const fetchBirthdays = async () => {
    setBirthdays(null);
    const req = await http({ method: 'POST', url: 'api/getBirthdays', form: { chat_id: chat.id } });

    if (req?.success) {
      setBirthdays(req?.found);
    } else {
      setMessage(req?.error);
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, [chat.id])

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
              <div className="w-8 mr-3 mt-1"><img className="w-full rounded-full shadow" src={'no'} /></div>
              <div className="flex-1">
                <div className="font-semibold">{birthday?.username || birthday?.first_name}</div>
                <div className="text-xs text-gray-600">{prettyDate(birthday?.bday) || <em>date error</em>}</div>
              </div>
              <div className="text-center mt-2">
                <Button onClick={() => { }} btnStyle="danger"> <FaTrash className="text-sm inline-block" /></Button>
              </div>
            </li>
          )}
        </ul>}
  </>
}

export default ManageChat;