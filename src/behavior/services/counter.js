import { default as BaseService } from './base'
import actions from '@actions'

export class CounterService extends BaseService {

  increment() {
    console.log('increment service called, this =',this)
    this.dispatch( actions.incrementRequested() )
    this.dispatch( actions.increment() )
  }

  incrementAsync() {
    this.dispatch( actions.incrementRequested() )
    this.dispatch( actions.increment() )
  }

  decrement() {
    this.dispatch( actions.decrementRequested() )
    this.dispatch( actions.decrement() )
  }

  decrementAsync() {
    this.dispatch( actions.decrementRequested() )
    this.dispatch( actions.decrement() )
  }

  // export const incrementAsync = () => {
  //   return dispatch => {
  //     dispatch({
  //       type: DECREMENT_REQUESTED
  //     })
  //
  //     return setTimeout(() => {
  //       dispatch({
  //         type: INCREMENT
  //       })
  //     }, 3000)
  //   }
  // }

  // export const decrementAsync = () => {
  //   return dispatch => {
  //     dispatch({
  //       type: DECREMENT_REQUESTED
  //     })
  //
  //     return setTimeout(() => {
  //       dispatch({
  //         type: DECREMENT
  //       })
  //     }, 3000)
  //   }
  // }

}
