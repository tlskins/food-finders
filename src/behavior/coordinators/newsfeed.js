
export const loadNewsfeed = ({ RestService, SessionService, pResponseFeedItems }) => async () => {
  const userId = SessionService.currentUserId()
  let feedItems = await RestService.get('/api/users/' + userId + '/newsfeed')
  feedItems = pResponseFeedItems( feedItems )

  return feedItems
}
