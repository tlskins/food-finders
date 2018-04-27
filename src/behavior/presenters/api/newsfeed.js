import React from 'react'

import { camelCaseify } from '~/utils'


export const pResponseFeedItems = json => {
  const newsfeedItems = camelCaseify( json )

  newsfeedItems.forEach( n => {
    if ( n.metadata ) {
      const { metadata } = n
      if ( metadata.foodRating ) {
        n.metadata.foodRatingTags = []
        Object.values( metadata.foodRating ).forEach( t => {
          if ( Array.isArray(t) ) {
            n.metadata.foodRatingTags = [...n.metadata.foodRatingTags, ...t]
          }
          else {
            n.metadata.foodRatingTags.push(t)
          }
        })
      }
      n.renderContent = () => {
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
  })

  return newsfeedItems
}
