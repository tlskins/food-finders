export const INCREMENT_REQUESTED = 'INCREMENT_REQUESTED'
export const INCREMENT = 'INCREMENT'
export const DECREMENT_REQUESTED = 'DECREMENT_REQUESTED'
export const DECREMENT = 'DECREMENT'

export const incrementRequested = () => ({ type: INCREMENT_REQUESTED })

export const increment = () => ({ type: INCREMENT })

export const decrementRequested = () => ({ type: DECREMENT_REQUESTED })

export const decrement = () => ({ type: DECREMENT })
