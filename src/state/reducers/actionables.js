import {
  LOAD_NEWSFEED,
  LOAD_ACTIONABLE,
} from '@actions/actionables'


const initialActionablesState = {
  newsfeed: [],
  actionablesDict: {}
}

export const actionables = (state = initialActionablesState, action) => {
  switch (action.type) {
    case LOAD_NEWSFEED: {
      const { newsfeed } = action
      const { actionablesDict } = state
      newsfeed.forEach( n => actionablesDict[n.id] = n )

      return { newsfeed: [...newsfeed], actionablesDict: { ...actionablesDict } }
    }
    case LOAD_ACTIONABLE: {
      const { actionable } = action
      const { actionablesDict } = state
      actionablesDict[actionable.id] = actionable

      return { ...state, actionablesDict: { ...actionablesDict } }
    }

    default:
      return state
  }
}
