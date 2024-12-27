import { useState, useEffect, createContext } from 'react';
import IndexRoute from './Routes/IndexRoute';

export const WidgetContext = createContext(null);

const BdayBotWebUI = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [curScreen, setCurScreen] = useState('index');

  const appRoutes = {
    'index': <IndexRoute />,
  };

  const curRoute = appRoutes?.[curScreen] || appRoutes['index'];

  return (
    <WidgetContext.Provider value={{ searchParams, setSearchParams }}>
      {curRoute}
    </WidgetContext.Provider>
  )
}

export default BdayBotWebUI;