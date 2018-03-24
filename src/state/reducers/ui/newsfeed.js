import {
  SELECT_NEWSFEED_ITEM,
} from '@actions/ui/newsfeed'


const initialState = { selectedItem: undefined }


export const newsfeed = ( state = initialState, action ) => {
  switch ( action.type ) {
  case SELECT_NEWSFEED_ITEM: {
    state.selectedItem = action.selectedItem
    return { ...state }
  }
  default:
    return state
  }
}
