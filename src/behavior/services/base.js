export default class BaseService {
  constructor( dispatch, getState ) {
    this.dispatch = dispatch
    this.getState = getState

    console.log('BaseService constructor - this.dispatch = ',this.dispatch)
    console.log('BaseService constructor - this.getState = ',this.getState)
  }
}
