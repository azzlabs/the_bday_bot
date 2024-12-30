import { useState, useEffect, createContext } from 'react';
import Alert from './Components/UI/Alert';
import LoginComponent from './Components/LoginComponent';
import { useLocalStorage } from '../utils/UseLocalStorage';
import ChooseChat from './Components/ChooseChat';

export const WebUIContext = createContext(null);

const BdayBotWebUI = () => {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
  const [message, setMessage] = useState(null);

  return (
    <WebUIContext.Provider value={{ currentUser, setCurrentUser, setMessage }}>
      <div className="mx-auto max-w-[30rem] w-full">
        <h2 className="text-center mb-4 text-2xl font-semibold">The Birthday Bot Web UI</h2>

        <div className="bg-white p-4 w-full rounded border border-slate-300">
          {message ? <Alert message={message} onDismiss={() => setMessage(null)} className="mb-3" /> : null}
          
          {currentUser ? 
            <ChooseChat /> :
            <LoginComponent />
          }
        </div>
      </div>
    </WebUIContext.Provider>
  )
}

export default BdayBotWebUI;