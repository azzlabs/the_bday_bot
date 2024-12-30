import React, { useContext } from "react";
import { WebUIContext } from "../BdayBotWebUI";
import Alert from "./UI/Alert";
import { FaSignOutAlt } from "react-icons/fa";

const BirthdaysEditor = () => {
    const { currentUser, setCurrentUser, setMessage } = useContext(WebUIContext);

    return <>
        <Alert>
            {currentUser?.photo_url ?
                <div className="w-8 mr-3"><img className="w-full rounded-full border border-sky-700" src={currentUser?.photo_url} /></div>
                : null}
            <div className="flex-1 font-semibold">Logged in as {currentUser?.username || currentUser?.first_name}</div>
            <button className="hover:opacity-60" onClick={() => setCurrentUser(null)} title="Logout">
                <FaSignOutAlt />
            </button>
        </Alert>
    
    </>
}

export default BirthdaysEditor;