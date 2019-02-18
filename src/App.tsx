// tslint:disable
import * as React from 'react';
import { PostControl } from './components/postcontrol/postControl';

import * as styles from  './App.less';
const logo = require('./logo.svg');

class App extends React.Component<{}, {}> {
  render() {
    return (
      <div className={styles.App}>
        <div className={styles.AppHeader}>
          <img src={logo} className={styles.AppLogo} alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className={styles.AppIntro}>
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <PostControl />
      </div>
    );
  }
}

export default App;