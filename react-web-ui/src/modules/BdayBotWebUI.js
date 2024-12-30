import { useState, useEffect, createContext } from 'react';
import Alert from './Components/UI/Alert';
import LoginComponent from './Components/LoginComponent';
import { useLocalStorage } from '../utils/UseLocalStorage';
import ChooseChat from './Components/ChooseChat';
import { FaGithub, FaReact, FaRegListAlt } from 'react-icons/fa';
import Modal from './Components/UI/Modal';

export const WebUIContext = createContext(null);

const BdayBotWebUI = () => {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
  const [showChangelog, setShowChangelog] = useState(null);
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
      <div className="mx-auto max-w-[30rem] w-full text-center mt-3 text-sm text-slate-700">
        Made with <FaReact className="inline text-sm mb-0.5" /> by <a href="https://github.com/azzlabs/" className="hover:text-sky-900">justzwolf</a><br />
        <a href="https://github.com/azzlabs/the_bday_bot" className="hover:text-sky-900"><FaGithub className="inline text-sm mb-0.5" /> Repo</a> &bull;{' '}
        <button className="hover:text-sky-900" onClick={() => setShowChangelog(true)}><FaRegListAlt className="inline text-sm mb-0.5" /> Changelog</button>
      </div>

      <Modal
        headerChildren="Web UI changelog"
        isVisible={showChangelog}
        size="xs"
        onClose={() => setShowChangelog(null)}
      >
        <h3 className="text-lg border-b font-semibold mb-2">Version 0.1.0 
          <small className="inline-block ml-2 text-gray-500 font-light text-xs">Nov 2024</small></h3>
        <p>Initial web UI release</p>
      </Modal>
    </WebUIContext.Provider>
  )
}

export default BdayBotWebUI;