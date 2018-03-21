import { connect } from 'react-redux'

import HierarchiesManager from '@components/hierarchiesManager/HierarchiesManager'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { allTaggables, editTaggable, hierarchiesManager, session, tagEditor } = state
  const { visible } = tagEditor
  const currentUser = session ? session.user : undefined
  const { status, unselectNodes } = hierarchiesManager
  const edited = editTaggable && editTaggable.edited

  return {
    allTaggables,
    editTaggable,
    edited,
    currentUser,
    hierarchiesManager,
    // status,
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
  // const setHierarchiesManagerStatus = status => UIService.HierarchiesManager.setHierarchiesManagerStatus(status)
  const toggleUnselectNodes = (status) => UIService.HierarchiesManager.toggleUnselectNodes(status)
  const resetTaggable = () => TaggablesService.resetTaggable()
  const loadEditTaggable = (taggable) => TaggablesService.loadEditTaggable(taggable)
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
    // setHierarchiesManagerStatus,
    toggleTagEditorVisibility,
    toggleUnselectNodes,
    updateTaggable,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HierarchiesManager)
