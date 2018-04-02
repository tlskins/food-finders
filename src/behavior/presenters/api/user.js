import { camelCaseify } from '~/utils'


export const pResponseUser = json => {
  const user = camelCaseify( json )

  const { draftSocialEntry } = user
  user.draftSocialEntry.tags = draftSocialEntry.tags || []

  return user
}
