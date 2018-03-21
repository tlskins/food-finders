import {
  LOAD_TAGGABLES,
  LOAD_EDIT_TAGGABLE,
  DELETE_TAGGABLE,
  EDIT_TAGGABLE,
  RESET_TAGGABLE,
} from '@actions/taggables'


const editTaggableState = { edited: false }

export const allTaggables = (state = {}, action) => {
  switch (action.type) {
    case LOAD_TAGGABLES: {
      if ( !state[action.taggableType] || action.overwrite) {
        state[action.taggableType] = {}
      }
      action.taggables.forEach( t => state[action.taggableType][t.id] = t )

      return { ...state }
    }
    case DELETE_TAGGABLE: {
      delete state[action.taggableType][action.taggableId]

      return { ...state }
    }

    default:
      return state
  }
}


export const editTaggable = (state = { ...editTaggableState }, action) => {
  switch (action.type) {
    case LOAD_EDIT_TAGGABLE: {
      return { ...action.taggable, edited: false }
    }
    case EDIT_TAGGABLE: {
      return { ...action.taggable, edited: true }
    }
    case RESET_TAGGABLE: {
      return { ...editTaggableState }
    }

    default:
      return state
  }
}
