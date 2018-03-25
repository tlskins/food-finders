export const SET_HIERARCHIES_MANAGER_LOCKED = 'SET_HIERARCHIES_MANAGER_LOCKED'

export const SET_HIERARCHIES_MANAGER_STATUS = 'SET_HIERARCHIES_MANAGER_STATUS'

export const RESET_HIERARCHIES_MANAGER = 'RESET_HIERARCHIES_MANAGER'

export const TOGGLE_UNSELECT_NODES = 'TOGGLE_UNSELECT_NODES'

export const SET_HIERARCHIES_MANAGER_TAGGABLE = 'SET_HIERARCHIES_MANAGER_TAGGABLE'


export const setHierarchiesManagerLocked = locked => ({ type: SET_HIERARCHIES_MANAGER_LOCKED, locked })

export const setHierarchiesManagerStatus = status => ({ type: SET_HIERARCHIES_MANAGER_STATUS, status })

export const resetHierarchiesManager = status => ({ type: RESET_HIERARCHIES_MANAGER })

export const toggleUnselectNodes = status => ({ type: TOGGLE_UNSELECT_NODES, status})

export const setHierarchiesManagerTaggable = (taggableType, taggableName) => ({ type: SET_HIERARCHIES_MANAGER_TAGGABLE, taggableType, taggableName })
