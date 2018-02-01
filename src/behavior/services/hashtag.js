import { default as BaseService } from './base'
import actions from '@actions'

export class HashtagService extends BaseService {
  addHashtags = hashtags => {
    this.dispatch( actions.addHashtags(hashtags) )
  }
}
