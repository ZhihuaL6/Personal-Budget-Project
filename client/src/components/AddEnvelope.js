import { useState } from 'react';


const AddEnvelope = ({onAdd}) => {
    const [title, setText] = useState('')
    const [budget, setBudget] = useState('')       

    const onSubmit = (e) => {
        e.preventDefault()

        if (!title || !budget){
            alert('Please add title or budget')
            return
        }
       
        onAdd({title, budget})

        setText('')
        setBudget('')
    }



    return (
        <form className= 'add-envelope' onSubmit={onSubmit}>
            <h2>Add Envelope</h2>
            <div className='form-control'>
                <label>Envelope</label>
                <input type='text' placeholder='Add Title'
                value={title} onChange={(e) => setText(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Budget</label>
                <input type='float' placeholder='Add Budget'
                value={budget} onChange={(e) => setBudget(e.target.value)}/>
            </div>

            <input type="submit" value='Save Envelope'
                className='btn btn-block'/>
        </form>
    )
}

export default AddEnvelope
