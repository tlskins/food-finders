import { default as BaseService } from './base'
import actions from '@actions'

export class TaggablesService extends BaseService {
  loadTaggables = (taggableType, taggables, overwrite = false) => {
    this.dispatch( actions.loadTaggables(taggableType, taggables, overwrite) )
  }

  deleteTaggable = (taggableType, taggableId) => {
    this.dispatch( actions.deleteTaggable(taggableType, taggableId) )
  }

  loadEditTaggable = (taggableType, taggable) => {
    this.dispatch( actions.loadEditTaggable(taggableType, taggable) )
  }

  editTaggable = taggable => {
    this.dispatch( actions.editTaggable(taggable) )
  }

  resetTaggable = () => {
    this.dispatch( actions.resetTaggable() )
  }
}
