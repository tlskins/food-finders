import { default as BaseService } from '../base'

import actions from '@actions'


export default class Home extends BaseService {
  selectNewsfeedItem({ selectedNewsfeedItem, selectedEntity }) {
    this.dispatch( actions.selectNewsfeedItem({ selectedNewsfeedItem, selectedEntity }))
  }

  updateClickedNewsfeedItem() {
    let clickedNewsfeedItem = this.getState().home.clickedNewsfeedItem
    const dict = this.getState().actionables.actionablesDict
    clickedNewsfeedItem = dict[clickedNewsfeedItem.id]
    this.dispatch( actions.toggleSocialEntryPage(clickedNewsfeedItem))
  }

  toggleSocialEntryPage(newsfeedItem) {
    this.dispatch( actions.toggleSocialEntryPage(newsfeedItem))
  }

  toggleNewsfeed() {
    this.dispatch( actions.toggleNewsfeed())
  }
}
