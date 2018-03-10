import {
  ADD_TREE,
} from '@actions/hierarchies'


const initialHierarchiesState = {}

export const hierarchies = (state = { ...initialHierarchiesState }, action) => {
  switch (action.type) {
    case ADD_TREE: {
      state[action.className] = action.tree

      return { ...state }
    }

    default:
      return state
  }
}
