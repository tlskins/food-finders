import { default as BaseService } from '../base'

import actions from '@actions'


export default class Errors extends BaseService {
  clear() {
    this.dispatch( actions.clearErrors())
  }

  updateErrors({ errors, namespace }) {
    this.dispatch( actions.updateErrors({ errors, namespace }))
  }
}
