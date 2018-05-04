import React from 'react'

import { camelCaseify, snakeCaseify } from '~/utils'


export const pRequestUpdateSocialEntry = ({ text, creatableTags, parentSocialEntryId }) => {
  const draftSocialEntry = {}
  draftSocialEntry.text = text
  draftSocialEntry.creatable_tags = snakeCaseify(creatableTags)
  draftSocialEntry.parent_social_entry_id = parentSocialEntryId
  const user = { draft_social_entry: draftSocialEntry }
  return { user }
}


export const pRequestPostSocialEntry = ({ text, creatableTags, parentSocialEntryId }) => {
  const req = {}
  req.text = text
  req.creatable_tags = snakeCaseify(creatableTags)
  req.parent_social_entry_id = parentSocialEntryId
  return req
}


export const pResponseSocialEntry = json => {
  const socialEntry = camelCaseify( json )
  const { metadata } = socialEntry

  if ( metadata && metadata.foodRating ) {
    socialEntry.isFoodRating = true
  }
  else {
    socialEntry.isFoodRating = false
  }

  if ( metadata ) {
    if ( metadata.foodRating ) {
      socialEntry.metadata.foodRatingTags = []
      Object.values( metadata.foodRating ).forEach( t => {
        if ( Array.isArray(t) ) {
          socialEntry.metadata.foodRatingTags = [...socialEntry.metadata.foodRatingTags, ...t]
        }
        else {
          socialEntry.metadata.foodRatingTags.push(t)
        }
      })
    }
    socialEntry.renderContent = () => {
      const { data, tags } = metadata

      if ( tags && tags.length > 0 ) {
        return(
          <div className='newsfeed-p'>
            { tags.map( (t,i) =>
              <div className='social-entry-text'>
                <div className='social-entry-text'>
                  { data.slice(((tags[i-1] && tags[i-1].tagEnd) || 0), t.tagStart) }
                </div>
                <div className={ 'social-entry-tag__' + (t.taggableType || '').toLowerCase() }>
                  { data.slice(t.tagStart,t.tagEnd) }
                </div>
                { i === tags.length - 1 && data.slice(t.tagEnd, ((tags[i+1] && tags[i+1].tagEnd)|| data.length)) }
              </div>
            )}
          </div>
        )
      }
      else {
        return(
          <div>
            { data }
          </div>
        )
      }
    }
  }

  return socialEntry
}
