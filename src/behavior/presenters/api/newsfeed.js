import React from 'react'

import { camelCaseify } from '~/utils'


export const pResponseFeedItems = json => {
  const newsfeedItems = camelCaseify( json )

  newsfeedItems.forEach( n => {
    const { metadata } = n
    n.renderContent = () => {
      const { data, tags } = metadata

      if ( tags && tags.length > 0 ) {
        return(
          <p className='newsfeed-p'>
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
          </p>
        )
      }
      else {
        return(
          <p>
            { data }
          </p>
        )
      }
    }
  })

  return newsfeedItems
}
