import {
  LOAD_NEWSFEED,
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

    default:
      return state
  }
}
