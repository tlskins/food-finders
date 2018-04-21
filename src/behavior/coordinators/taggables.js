
export const LoadTaggable = ({ RestService, TaggablesService, pResponseTaggable, UIService }) => async (taggableType, id) => {
  const { allTaggables } = TaggablesService.getState()
  const taggables = allTaggables[taggableType]

  if (taggables && taggables[id]) {
    return taggables[id]
  }
  else {
    const response = await RestService.get(`/api/${ taggableType }/${ id }`)
    const taggable = pResponseTaggable(response)
    TaggablesService.loadTaggables(taggableType, taggable)
    return taggable
  }
}


export const LoadTaggables = ({ RestService, TaggablesService, pResponseTaggables, UIService }) => async (taggableType, overwrite = false) => {
  const { allTaggables } = TaggablesService.getState()
  let taggables = allTaggables[taggableType]

  if ( !taggables || overwrite ) {
    const response = await RestService.get(`/api/${ taggableType }`)
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
        response = await RestService.put(`/api/${ taggableType }/${ id }`, params)
      }
      else {
        response = await RestService.post(`/api/${ taggableType }/`, params)
      }
      const taggable = pResponseTaggable(response)
      TaggablesService.loadEditTaggable(taggableType, taggable)
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
      await RestService.delete(`/api/${ taggableType }/${ id }`)
      TaggablesService.resetTaggable()
      UIService.TagEditor.toggleVisibility(false)
      await LoadTaggables({ RestService, TaggablesService, pResponseTaggables, UIService })(taggableType, true)
    }
    catch ( error ) {
      HandleError({ error, namespace: 'taggables'})
    }
}
