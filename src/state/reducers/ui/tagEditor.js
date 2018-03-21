import {
  TAG_EDITOR_TOGGLE_VISIBILITY,
} from '@actions/ui/tagEditor'


const initialState = {
  visible: false,
}


export const tagEditor = ( state = initialState, action ) => {
  switch ( action.type ) {
  case TAG_EDITOR_TOGGLE_VISIBILITY: return { visible: action.visible }
  default:
    return state
  }
}
