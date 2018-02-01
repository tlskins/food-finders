import {
  ADD_FOODS,
} from '@actions/foods'

export const foods = (state = {}, action) => {
  switch (action.type) {
    case ADD_FOODS: {
      action.foods.forEach( e => state[e.handle] = e )

      return { ...state }
    }

    default:
      return state
  }
}
