import {
  ADD_HASHTAGS,
} from '@actions/hashtags'

export const hashtags = (state = {}, action) => {
  switch (action.type) {
    case ADD_HASHTAGS: {
      action.hashtags.forEach( e => state[e.handle] = e )

      return { ...state }
    }

    default:
      return state
  }
}
