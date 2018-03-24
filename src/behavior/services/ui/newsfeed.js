import { default as BaseService } from '../base'

import actions from '@actions'


export default class Newsfeed extends BaseService {
  selectNewsfeedItem( selectedItem ) {
    this.dispatch( actions.selectNewsfeedItem( selectedItem ))
  }
}
