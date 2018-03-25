
export const initialDiagramsState = {
	baseRootX: 20,
  baseRootY: 50,
	maxNodeY: 50,
  nodeXDistance: 100,
  nodeYDistance: 70,
	dictionary: {},
	nodeColor: "rgb(0,192,255)",
	selectedNodeColor: "rgb(192,255,0)",
}

// Diagram Helpers

export function getNode(name, model) {
  return Object.values(model.nodes).find( n => n.name === name )
}

export function getToParentLink(nodeName, model) {
  const node = getNode(nodeName, model)
  if ( node ) {
    const firstPort = node.getInPorts()[0]
    if ( firstPort ) {
      return { port: firstPort, link: Object.values(firstPort.links)[0] }
    }
  }
  return undefined
}

export function linkFromTo(childNode, parentNode) {
  const parentOutPort = getOrCreateOutPort(parentNode)
  const childInPort = getOrCreateInPort(childNode)
  const link = parentOutPort.link(childInPort)
  link.setColor('Black')
  link.setWidth(7)
  return link
}

export function getOrCreateOutPort(node) {
  let outPort = node && node.getOutPorts()[0]
  if ( !outPort ) {
    outPort = node.addOutPort(" ")
  }
  return outPort
}

export function getOrCreateInPort(node) {
  let inPort = node && node.getInPorts()[0]
  if ( !inPort ) {
    inPort = node.addInPort(" ")
  }
  return inPort
}
