import { camelCaseify } from '~/utils'
import { pResponseSocialEntry } from './socialEntry'

export const pResponseFeedItems = json => {
  let newsfeedItems = camelCaseify( json )

  newsfeedItems = newsfeedItems.map( n => pResponseSocialEntry(n) )

  return newsfeedItems
}
