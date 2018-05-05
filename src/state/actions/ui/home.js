export const SELECT_NEWSFEED_ITEM = 'SELECT_NEWSFEED_ITEM'

export const TOGGLE_SOCIAL_ENTRY_PAGE = 'TOGGLE_SOCIAL_ENTRY_PAGE'

export const TOGGLE_NEWSFEED = 'TOGGLE_NEWSFEED'



export const selectNewsfeedItem = ({ selectedNewsfeedItem, selectedEntity }) => ({ type: SELECT_NEWSFEED_ITEM, selectedEntity, selectedNewsfeedItem })

export const toggleSocialEntryPage = newsfeedItem => ({ type: TOGGLE_SOCIAL_ENTRY_PAGE, newsfeedItem })

export const toggleNewsfeed = () => ({ type: TOGGLE_NEWSFEED })
