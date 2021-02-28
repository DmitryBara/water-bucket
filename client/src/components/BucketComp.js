import React, {useState, useEffect} from 'react'

import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {BucketStates} from './BucketStatesComp'


function useFormHandler ( formInputValues ) {

    const [form, setForm] = useState( formInputValues )

    const { error, request, clearError} = useHttp()
    const message = useMessage()
    
    useEffect( () => {
      message(error)
      clearError()
    }, [error, message, clearError])
    
    const changeHandler = event => {
      setForm({...form, [event.target.name]: event.target.value })
    }

    return {form, request, changeHandler}
}


function BucketDataComp({chainsOfBucketStates}) {

  const {form, request, changeHandler} = useFormHandler({X: "", Y: "", Z: ""});

  const [chains, setChains] = useState(null)

  const submitHandler = async () => {
    try {
      const data = await request('/api/bucket/check', 'POST', {...form})
      console.log(data)
      setChains(data.chains)
    } catch (e) {}
  }

return (
  <div className="input-container">

    <div className="input-field">
      <input 
        id="X" 
        name="X"
        type="number"
        autoComplete="off"
        className="field"
        value={form.X}
        onChange={changeHandler} 
        />
      <label htmlFor="X">Input X:</label>
    </div>

    <div className="input-field">
      <input 
        id="Y" 
        name="Y"
        type="number"
        autoComplete="off"
        className="field"
        value={form.Y}
        onChange={changeHandler} 
        />
      <label htmlFor="login">Input Y:</label>
    </div>
    
    <div className="input-field">
      <input 
        id="Z" 
        name="Z"
        type="number"
        className="field"
        value={form.Z}
        onChange={changeHandler} />
      <label htmlFor="password">Input Z:</label>
    </div>

    <button 
      className="btn blue lighten-2" 
      onClick={submitHandler}
      disabled={!form.X || !form.Y || !form.Z }>
      Check!
    </button>

    { chains && <BucketStates chains={chains}></BucketStates> }

  </div>
)}

export {BucketDataComp}