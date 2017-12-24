import {
  SET_BEST_AWARDS,
} from '@actions/bestAward'

export const bestAwards = (state = [], action) => {
  switch (action.type) {
    case SET_BEST_AWARDS:
      return {
        ...state,
        all: action.bestAwards.splice()
      }

    default:
      return state
  }
}
