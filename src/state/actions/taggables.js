export const NEW_TAGGABLE = 'NEW_TAGGABLE'

export const LOAD_TAGGABLES = 'LOAD_TAGGABLES'

export const DELETE_TAGGABLE = 'DELETE_TAGGABLE'

export const LOAD_EDIT_TAGGABLE = 'LOAD_EDIT_TAGGABLE'

export const EDIT_TAGGABLE = 'EDIT_TAGGABLE'

export const EDIT_TAGGABLE_HANDLE = 'EDIT_TAGGABLE_HANDLE'

export const RESET_TAGGABLE = 'RESET_TAGGABLE'


export const newTaggable = taggable => ({ type: NEW_TAGGABLE, taggable })

export const loadTaggables = (taggableType, taggables, overwrite = false) => ({ type: LOAD_TAGGABLES, taggables, taggableType, overwrite })

export const deleteTaggable = (taggableType, taggableId) => ({ type: DELETE_TAGGABLE, taggableType, taggableId })

export const loadEditTaggable = (taggableType, taggable) => ({ type: LOAD_EDIT_TAGGABLE, taggableType, taggable })

export const editTaggable = taggable => ({ type: EDIT_TAGGABLE, taggable })

export const editTaggableHandle = handle => ({ type: EDIT_TAGGABLE_HANDLE, handle })

export const resetTaggable = () => ({ type: RESET_TAGGABLE })
