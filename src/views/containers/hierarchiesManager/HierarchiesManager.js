import { connect } from 'react-redux'

import HierarchiesManager from '@components/hierarchiesManager/HierarchiesManager'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { allTaggables, editTaggable, hierarchiesManager, session, tagEditor } = state
  const { visible } = tagEditor
  const currentUser = session ? session.user : undefined
  const { unselectNodes } = hierarchiesManager
  const edited = editTaggable && editTaggable.edited

  return {
    allTaggables,
    editTaggable,
    edited,
    currentUser,
    hierarchiesManager,
    unselectNodes,
    visible,
  }
}

const mapDispatchToProps = () => {
  const {
    RouterService,
    TaggablesService,
    RestService,
    UIService,
  } = services
  const { pResponseGeneric } = presenters.Api
  const pResponseTaggables = pResponseGeneric

  const toggleTagEditorVisibility = visible => UIService.TagEditor.toggleVisibility(visible)
  const redirect = () => RouterService.replace({ pathname: '/login' })
  const toggleUnselectNodes = (status) => UIService.HierarchiesManager.toggleUnselectNodes(status)
  const setHierarchiesManagerTaggable = (taggableType, taggableName) => UIService.HierarchiesManager.setHierarchiesManagerTaggable(taggableType, taggableName)
  const resetTaggable = () => TaggablesService.resetTaggable()
  const loadEditTaggable = (taggableType, taggable) => TaggablesService.loadEditTaggable(taggableType, taggable)
  const updateTaggable = (taggable) => TaggablesService.editTaggable(taggable)
  const loadTaggables = coordinators.LoadTaggables({
    RestService,
    TaggablesService,
    pResponseTaggables,
    UIService
  })

  return {
    loadEditTaggable,
    loadTaggables,
    redirect,
    resetTaggable,
    setHierarchiesManagerTaggable,
    toggleTagEditorVisibility,
    toggleUnselectNodes,
    updateTaggable,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HierarchiesManager)
