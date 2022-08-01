import { useState, useEffect } from 'react'
import fillForm from './_fill-form'
import findPath from './_find-path'

const useForm = (formRef, initialState, options = {}) => {
  const [theForm, setForm] = useState(null)

  const { persist } = options

  if (!!persist) {
    let lsState = localStorage.getItem(persist)
    if (lsState) {
      initialState = JSON.parse(lsState)
    }
  }

  useEffect(() => {
    setForm(formRef.current)
  }, [formRef])

  useEffect(() => {
    if (theForm) {
      fillForm(theForm, initialState)
    }
  }, [theForm])

  const [state, setState] = useState(initialState || {})

  const onChange = ev => {
    setState(state => {
      const target = ev.target
      const { name, value, dataset } = target
      const type = target.dataset.type || target.type
      const path = findPath(target, theForm)

      const newState = { ...state }
      let targetObj = newState
      for (let prop of path) {
        targetObj[prop] = targetObj[prop] || {}
        targetObj = targetObj[prop]
      }

      //Case for Checkbox:
      if (target.type === 'checkbox') {
        const { checked } = target
        const count = theForm[name].length
        if (count > 1) {
          targetObj[name] = [...theForm[name]].filter(c => c.checked).map(c => c.value)
        } else {
          targetObj[name] = checked
        }
      } else if (target.nodeName === 'SELECT' && target.multiple) {
        targetObj[name] = [...target.options].filter(o => o.selected).map(o => o.value)
      } else {
        targetObj[name] = ['number', 'range'].includes(type) ? +value : value
      }

      if (persist) {
        localStorage.setItem(persist, JSON.stringify(newState))
      }
      return newState
    })
  }

  const clear = () => {
    if (!!persist) {
      localStorage.removeItem(persist)
    }
    setState(null)
    theForm.reset()
  }

  return [state, onChange, clear]
}

export default useForm
