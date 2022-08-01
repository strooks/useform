const findPath = (elem, form, path = []) => {
  let parent = elem.parentNode

  while (parent !== form) {
    if (parent.nodeName.toLowerCase() === 'fieldset') {
      if (parent.name) {
        path.push(parent.name)
      }
    }
    parent = parent.parentNode
  }
  return path
}

export default findPath
