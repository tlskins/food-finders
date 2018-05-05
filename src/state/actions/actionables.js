export const LOAD_NEWSFEED = 'LOAD_NEWSFEED'

export const LOAD_ACTIONABLE = 'LOAD_ACTIONABLE'


export const loadNewsfeed = newsfeed => ({ type: LOAD_NEWSFEED, newsfeed })

export const loadActionable = actionable => ({ type: LOAD_ACTIONABLE, actionable })
