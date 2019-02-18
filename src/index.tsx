import * as React from 'react';
import * as ReactDOM from 'react-dom';
///////////////////////////////////draft js pollyfills for IE/////////////////////////////////
import './pollyfill/pollyfillCheck';
//////////////////////MOBX forced to run in non strict mode, as we ////////////////////////
/////////////////////have many code that change observabled directly ///////////////////////
import { useStrict } from 'mobx';
useStrict(false); // run Mobx on non strict mode

import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
