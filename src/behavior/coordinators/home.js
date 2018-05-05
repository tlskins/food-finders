
export const SelectNewsfeedItem = ({ UIService, pTaggableClassToType, LoadTaggable }) => async selectedNewsfeedItem => {
  let selectedEntity = undefined
  let entityTag = undefined

  // Find entity tag
  if ( selectedNewsfeedItem && selectedNewsfeedItem.metadata ) {
    const { metadata } = selectedNewsfeedItem
    if ( metadata.foodRating ) {
      entityTag = selectedNewsfeedItem.metadata.foodRating.ratee
    }
    else if ( metadata.tags && metadata.tags.length > 0 ) {
      entityTag = metadata.tags.find( t => t.taggableType === 'Entity' )
    }
  }

  if ( entityTag ) {
    const taggableType = pTaggableClassToType(entityTag.taggableType)
    selectedEntity = await LoadTaggable( taggableType, entityTag.handle )
  }
  UIService.Home.selectNewsfeedItem({ selectedNewsfeedItem, selectedEntity })
}


export const LoadSocialEntryPage = ({ ActionablesService, RestService, UIService, pResponseSocialEntry }) => async actionableId => {
  let actionable = ActionablesService.findActionable(actionableId)

  if ( !actionable ) {
    const payload = { social_entry_id: actionableId }
    actionable = await RestService.get('/api/actionables/find', payload )
    actionable = pResponseSocialEntry(actionable)
    ActionablesService.loadActionable(actionable)
  }

  UIService.Home.toggleSocialEntryPage(actionable)
}
