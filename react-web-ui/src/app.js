import './scss/app.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import BdayBotWebUI from './modules/BdayBotWebUI';

const root = ReactDOM.createRoot(document.getElementById('bdaybot-app'));
root.render(<BdayBotWebUI />);