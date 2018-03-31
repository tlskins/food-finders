import {
  LOAD_TAGGABLES,
  LOAD_EDIT_TAGGABLE,
  DELETE_TAGGABLE,
  EDIT_TAGGABLE,
  RESET_TAGGABLE,
  NEW_TAGGABLE,
  EDIT_TAGGABLE_HANDLE,
} from '@actions/taggables'


const initialEditTaggableState = { edited: false, taggableType: undefined }

const newTaggableState = {
  handle: "",
  name: "",
  synonyms: [],
  description: "",
}

export const allTaggables = (state = {}, action) => {
  switch (action.type) {
    case LOAD_TAGGABLES: {
      if ( !state[action.taggableType] || action.overwrite) {
        state[action.taggableType] = {}
      }

      if ( Array.isArray(action.taggables) ) {
        action.taggables.forEach( t => state[action.taggableType][t.id] = t )
      }
      else {
        state[action.taggableType][action.taggables.id] = action.taggables
      }

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


export const editTaggable = (state = initialEditTaggableState, action) => {
  switch (action.type) {

    // TODO - transform all edits to handle to correclty parsed handle format

    case NEW_TAGGABLE: {
      const { taggable } = action
      return { ...newTaggableState, ...taggable, edited: true }
    }
    case LOAD_EDIT_TAGGABLE: {
      const { taggable, taggableType } = action

      return { taggableType, ...taggable, edited: false }
    }
    case EDIT_TAGGABLE: {
      return { ...state, ...action.taggable, edited: true }
    }
    case EDIT_TAGGABLE_HANDLE: {
      const { handle } = action

      return { ...state, handle, edited: true }
    }
    case RESET_TAGGABLE: {
      return { ...initialEditTaggableState }
    }

    default:
      return state
  }
}
