import { combineReducers } from 'redux'

import game from './game'

export const rootReducers = {
  game,
}

export default combineReducers({
  ...rootReducers,
})
