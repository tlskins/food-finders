import {
  ADD_ENTITIES,
  ADD_YELP_BUSINESS_ENTITIES,
} from '@actions/entities'

export const entities = (state = {}, action) => {
  switch (action.type) {
    case ADD_ENTITIES: {
      action.entities.forEach( e => state[e.handle] = e )

      return { ...state }
    }
    case ADD_YELP_BUSINESS_ENTITIES: {
      action.businesses.forEach( b => {
        if ( !state[b.id] ) {
          state[b.id] = { symbol: '@', handle: b.id, name: b.name, yelp_business: b }
        }
      })

      return { ...state }
    }

    default:
      return state
  }
}
