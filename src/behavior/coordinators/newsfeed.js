
export const loadNewsfeed = ({ RestService, SessionService, pResponseFeedItems }) => async () => {
  const userId = SessionService.currentUserId()
  let feedItems = []
  if ( userId ) {
    feedItems = await RestService.get('/api/users/' + userId + '/newsfeed')
    feedItems = pResponseFeedItems( feedItems )
  }
  else {
    feedItems = await RestService.get('/api/actionables')
    feedItems = pResponseFeedItems( feedItems )
  }

  return feedItems
}
