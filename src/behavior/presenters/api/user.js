import { camelCaseify } from '~/utils'


export const pResponseUser = json => {
  const user = camelCaseify( json )

  const { draftSocialEntry, firstName, lastName } = user
  user.draftSocialEntry.tags = draftSocialEntry.tags || []
  user.fullName = [ firstName, lastName ].filter( o => o ).join( ' ' )

  return user
}
