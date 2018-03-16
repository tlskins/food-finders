import {
  SET_HIERARCHIES_MANAGER_STATUS,
  SET_HIERARCHIES_MANAGER_LOCKED,
  RESET_HIERARCHIES_MANAGER,
} from '@actions/ui/hierarchiesManager'


const initialState = {
  locked: true,
  status: 'DEFAULT',
}


export const hierarchiesManager = ( state = { ...initialState}, action ) => {
  switch ( action.type ) {
  case SET_HIERARCHIES_MANAGER_STATUS: return { ...state, status: action.status }
  case SET_HIERARCHIES_MANAGER_LOCKED: return { ...state, locked: action.locked }
  case RESET_HIERARCHIES_MANAGER: return { ...initialState }
  default:
    return state
  }
}
