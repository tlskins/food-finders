import {
  LOAD_NEWSFEED,
} from '@actions/actionables'


const initialActionablesState = {
  newsfeed: [],
  actionables: {}
}

export const actionables = (state = initialActionablesState, action) => {
  switch (action.type) {
    case LOAD_NEWSFEED: {
      const { newsfeed } = action
      const { actionables } = state
      newsfeed.forEach( n => actionables[n.id] = n )

      return { newsfeed: [...newsfeed], actionables: { ...actionables } }
    }

    default:
      return state
  }
}
