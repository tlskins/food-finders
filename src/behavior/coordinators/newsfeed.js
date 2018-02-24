
export const loadNewsfeed = ({ RestService, SessionService, pResponseFeedItems }) => async () => {
  const userId = SessionService.currentUserId()
  let feedItems = await RestService.get('/users/' + userId + '/newsfeed')
  feedItems = pResponseFeedItems( feedItems )

  return feedItems
}
