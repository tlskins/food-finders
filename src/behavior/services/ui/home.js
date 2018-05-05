import { default as BaseService } from '../base'

import actions from '@actions'


export default class Home extends BaseService {
  selectNewsfeedItem({ selectedNewsfeedItem, selectedEntity }) {
    this.dispatch( actions.selectNewsfeedItem({ selectedNewsfeedItem, selectedEntity }))
  }

  toggleSocialEntryPage(newsfeedItem) {
    this.dispatch( actions.toggleSocialEntryPage(newsfeedItem))
  }

  toggleNewsfeed() {
    this.dispatch( actions.toggleNewsfeed())
  }
}
