import {
  TAG_EDITOR_TOGGLE_VISIBILITY,
  TAG_EDITOR_SET_TAG_SYMBOL,
} from '@actions/ui/tagEditor'


const initialState = {
  visible: false,
  tagSymbol: undefined,
}


export const tagEditor = ( state = initialState, action ) => {
  switch ( action.type ) {
  case TAG_EDITOR_TOGGLE_VISIBILITY: return { ...state, visible: action.visible }
  case TAG_EDITOR_SET_TAG_SYMBOL: return { ...state, tagSymbol: action.tagSymbol }
  default:
    return state
  }
}
