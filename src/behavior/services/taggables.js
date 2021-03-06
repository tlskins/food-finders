import { default as BaseService } from './base'
import actions from '@actions'

export class TaggablesService extends BaseService {
  getEditTaggable = () => {
    return this.getState().editTaggable
  }

  newTaggable = taggable => {
    this.dispatch( actions.newTaggable(taggable) )
  }

  loadTaggable = (taggableType, taggable, overwrite = false) => {
    this.dispatch( actions.loadTaggable(taggableType, taggable, overwrite) )
  }

  loadTaggables = (taggableType, taggables, overwrite = false) => {
    this.dispatch( actions.loadTaggables(taggableType, taggables, overwrite) )
  }

  deleteTaggable = (taggableType, taggableId) => {
    this.dispatch( actions.deleteTaggable(taggableType, taggableId) )
  }

  loadEditTaggable = (taggableType, taggable) => {
    this.dispatch( actions.loadEditTaggable(taggableType, taggable) )
  }

  loadNewTaggable = (taggableType, taggable) => {
    this.dispatch( actions.loadNewTaggable(taggableType, taggable) )
  }

  editTaggable = taggable => {
    this.dispatch( actions.editTaggable(taggable) )
  }

  editTaggableHandle = handle => {
    this.dispatch( actions.editTaggableHandle(handle) )
  }

  resetTaggable = () => {
    this.dispatch( actions.resetTaggable() )
  }
}
