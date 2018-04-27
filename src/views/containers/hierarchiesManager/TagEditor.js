import { connect } from 'react-redux'

import TagEditor from '@components/hierarchiesManager/TagEditor'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { editTaggable, tagEditor, session } = state
  const { visible } = tagEditor
  const edited = editTaggable && editTaggable.edited
  const taggableType = editTaggable && editTaggable.taggableType
  const currentUser = session ? session.user : undefined

  return {
    currentUser,
    edited,
    editTaggable,
    taggableType,
    visible,
  }
}

const mapDispatchToProps = () => {
  const {
    TaggablesService,
    RestService,
    UIService,
  } = services
  const { pResponseGeneric, pRequestTaggable } = presenters.Api
  const pResponseTaggable = pResponseGeneric
  const pResponseTaggables = pResponseGeneric

  const toggleVisibility = visible => UIService.TagEditor.toggleVisibility(visible)
  const toggleUnselectNodes = (status) => UIService.HierarchiesManager.toggleUnselectNodes(status)
  const updateTaggable = (taggable) => TaggablesService.editTaggable(taggable)
  const deleteTaggable = coordinators.DeleteTaggable({
    RestService,
    TaggablesService,
    pResponseTaggable,
    pResponseTaggables,
    pRequestTaggable,
    HandleError,
    UIService,
  })
  const loadTaggables = coordinators.LoadTaggables({
    RestService,
    TaggablesService,
    pResponseTaggables,
    UIService,
  })
  const saveTaggable = coordinators.SaveTaggable({
    RestService,
    TaggablesService,
    UIService,
    pResponseTaggable,
    pResponseTaggables,
    pRequestTaggable,
    HandleError,
  })

  return {
    deleteTaggable,
    loadTaggables,
    saveTaggable,
    toggleUnselectNodes,
    toggleVisibility,
    updateTaggable,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagEditor)
