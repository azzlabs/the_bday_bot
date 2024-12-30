import React, { useContext } from "react";
import { LoginButton } from '@telegram-auth/react';
import { WebUIContext } from "../BdayBotWebUI";
import { http } from "../../utils/Utils";
const botName = process.env.BOT_NAME;

const LoginComponent = () => {
  const { setCurrentUser, setMessage } = useContext(WebUIContext);

  return (
    <>
      <p className="text-center text-xl font-semibold mb-0.5">
        Sign in with Telegram
      </p>
      <p className="text-center text-xs text-gray-600 mb-4">
        click the button below to continue
      </p>
      <div className="flex justify-center">
        <LoginButton
          botUsername={botName}
          onAuthCallback={async (data) => {
            const auth_user = await http({ url: 'api/auth', form: data, method: 'POST' });

            if (auth_user?.success) {
              setCurrentUser({ token: auth_user?.bearer, ...data });
            } else {
              setMessage({ type: 'error', content: `Authentication failed ${auth_user?.error}` });
            }
          }}
        />
      </div>
    </>
  )
}

export default LoginComponent;