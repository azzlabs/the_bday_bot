import React from "react";
import { LoginButton } from '@telegram-auth/react';
import { http } from "../../utils/Utils";

const botName = 'the_bday_test_bot';

const IndexRoute = () => {

  return (<>
  <p>Hello world!</p>
  <LoginButton
    botUsername={botName}
    onAuthCallback={async (data) => {
      // console.log(data);
      // call your backend here to validate the data and sign in the user

      console.log(await http({ url: 'api/auth', form: data, method: 'POST' }));
    }}
  />
  </>
    
  )
}

export default IndexRoute;