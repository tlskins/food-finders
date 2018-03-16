export const TAG_EDITOR_TOGGLE_VISIBILITY = 'TAG_EDITOR_TOGGLE_VISIBILITY'

export const TAG_EDITOR_SET_TAG_SYMBOL = 'TAG_EDITOR_SET_TAG_SYMBOL'



export const tagEditorSetTagSymbol = tagSymbol => ({ type: TAG_EDITOR_SET_TAG_SYMBOL, tagSymbol })

export const tagEditorToggleVisibility = visible => ({ type: TAG_EDITOR_TOGGLE_VISIBILITY, visible })
