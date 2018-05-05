import {
  SELECT_NEWSFEED_ITEM,
  TOGGLE_SOCIAL_ENTRY_PAGE,
  TOGGLE_NEWSFEED,
} from '@actions/ui/home'


const initialState = {
  mode: 'Newsfeed',
  clickedNewsfeedItem: undefined,
  selectedNewsfeedItem: undefined,
  selectedEntity: undefined,
}


export const home = ( state = initialState, action ) => {
  switch ( action.type ) {
  case SELECT_NEWSFEED_ITEM: {
    const { selectedEntity = state.selectedEntity } = action

    return {
      ...state,
      selectedNewsfeedItem: action.selectedNewsfeedItem,
      selectedEntity: selectedEntity,
    }
  }
  case TOGGLE_SOCIAL_ENTRY_PAGE:
    return {
      ...state,
      mode: 'SocialEntryPage',
      clickedNewsfeedItem: action.newsfeedItem,
      selectedNewsfeedItem: undefined,
      selectedEntity: undefined,
    }
  case TOGGLE_NEWSFEED:
    return {
      ...state,
      mode: 'Newsfeed',
      selectedNewsfeedItem: undefined,
      selectedEntity: undefined,
      clickedNewsfeedItem: undefined,
    }
  default:
    return state
  }
}
