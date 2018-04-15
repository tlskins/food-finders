import { snakeCaseify } from '~/utils'


export const pRequestUpdateSocialEntry = ({ text, creatableTags, parentSocialEntryId }) => {
  const draftSocialEntry = {}
  draftSocialEntry.text = text
  draftSocialEntry.creatable_tags = snakeCaseify(creatableTags)
  draftSocialEntry.parent_social_entry_id = parentSocialEntryId
  const user = { draft_social_entry: draftSocialEntry }
  return { user }
}


export const pRequestPostSocialEntry = ({ text, creatableTags }) => {
  const req = {}
  req.text = text
  req.creatable_tags = snakeCaseify(creatableTags)
  return req
}
