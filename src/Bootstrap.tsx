import * as React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import App from '~components/App';

import '~app/assets/favicon.ico';

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('example-app'),
);
