import { default as BaseService } from './base'
import {
  goBack,
  goForward,
  push as routerPush,
  replace as routerReplace,
} from 'react-router-redux'


export class RouterService extends BaseService {
  push( uri ) {
    this.dispatch( routerPush( uri ))
  }

  replace( uri ) {
    this.dispatch( routerReplace( uri ))
  }

  back() {
    this.dispatch( goBack())
  }

  forward() {
    this.dispatch( goForward())
  }
}
