
export const LoadTaggables = ({ RestService, TaggablesService, pResponseTaggables, UIService }) => async (taggableType, overwrite = false) => {
  const { allTaggables } = TaggablesService.getState()
  let taggables = allTaggables[taggableType]

  if ( !taggables || overwrite ) {
    const response = await RestService.get(`${ taggableType }`)
    taggables = pResponseTaggables(response)
    TaggablesService.loadTaggables(taggableType, taggables, true)
  }
}


export const SaveTaggable = ({
  RestService,
  TaggablesService,
  UIService,
  pResponseTaggable,
  pResponseTaggables,
  pRequestTaggable,
  HandleError,
}) => async (taggableType, json) => {
    const { id } = json
    const params = {}
    const paramsKey = taggableType.replace(/s$/, '')
    params[paramsKey] = pRequestTaggable(json)

    try {
      let response = undefined
      if ( id ) {
        response = await RestService.put(`${ taggableType }/${ id }`, params)
      }
      else {
        response = await RestService.post(`${ taggableType }/`, params)
      }
      const taggable = pResponseTaggable(response)
      // TaggablesService.loadTaggables(taggableType, [taggable])
      TaggablesService.loadEditTaggable(taggable)
      UIService.TagEditor.toggleVisibility(true)
      await LoadTaggables({ RestService, TaggablesService, pResponseTaggables, UIService })(taggableType, true)
    }
    catch ( error ) {
      HandleError({ error, namespace: 'taggables'})
    }
}


export const DeleteTaggable = ({
  UIService,
  RestService,
  TaggablesService,
  pResponseTaggables,
  pResponseTaggable,
  pRequestTaggable,
  HandleError,
}) => async (taggableType, id) => {
    try {
      await RestService.delete(`${ taggableType }/${ id }`)
      // TaggablesService.deleteTaggable(taggableType, id)
      TaggablesService.resetTaggable()
      UIService.TagEditor.toggleVisibility(false)
      await LoadTaggables({ RestService, TaggablesService, pResponseTaggables, UIService })(taggableType, true)
    }
    catch ( error ) {
      HandleError({ error, namespace: 'taggables'})
    }
}
