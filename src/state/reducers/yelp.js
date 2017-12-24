import {
  SET_YELP_SUGGESTED_LOCATIONS,
} from '@actions/yelp'

const initialState = {
  suggestedLocations: [],
}

export const yelp = (state = initialState, action) => {
  switch (action.type) {
    case SET_YELP_SUGGESTED_LOCATIONS:
      return {
        ...state,
        suggestedLocations: action.locations.slice(),
      }

    default:
      return state
  }
}
