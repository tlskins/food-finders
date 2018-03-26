import { snakeCaseify } from '~/utils'


export const pRequestUpdateSocialEntry = ({ text, creatableTags }) => {
  const draftSocialEntry = {}
  draftSocialEntry.text = text
  draftSocialEntry.creatable_tags = snakeCaseify(creatableTags)
  const user = { draft_social_entry: draftSocialEntry }
  return { user }
}
