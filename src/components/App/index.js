import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '../../store'
import ConnectedGame from '../Game'

const store = configureStore()

const App = () => (
  <Provider store={store}>
    <ConnectedGame />
  </Provider>
)

export default App
