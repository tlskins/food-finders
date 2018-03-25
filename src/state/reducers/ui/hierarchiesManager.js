import {
  SET_HIERARCHIES_MANAGER_STATUS,
  SET_HIERARCHIES_MANAGER_LOCKED,
  RESET_HIERARCHIES_MANAGER,
  SET_HIERARCHIES_MANAGER_TAGGABLE,
  TOGGLE_UNSELECT_NODES,
} from '@actions/ui/hierarchiesManager'


const initialState = {
  locked: true,
  status: 'DEFAULT',
  unselectNodes: false,
  taggableType: 'food_rating_metrics',
  taggableName: 'Rating Metric',
}


export const hierarchiesManager = ( state = { ...initialState}, action ) => {
  switch ( action.type ) {
  case SET_HIERARCHIES_MANAGER_STATUS: return { ...state, status: action.status }
  case SET_HIERARCHIES_MANAGER_LOCKED: return { ...state, locked: action.locked }
  case SET_HIERARCHIES_MANAGER_TAGGABLE: {
    return { ...state, taggableType: action.taggableType, taggableName: action.taggableName }
  }
  case TOGGLE_UNSELECT_NODES: return { ...state, unselectNodes: action.status }
  case RESET_HIERARCHIES_MANAGER: return { ...initialState }
  default:
    return state
  }
}
