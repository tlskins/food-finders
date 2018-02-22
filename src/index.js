import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import WebFont from 'webfontloader'
import store, { history } from './store'
import App from '@components/app'

import './index.css'

WebFont.load({
  google: {
    families: ['Merriweather Sans', 'sans-serif']
  }
})

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>, document.querySelector('#root')
)
