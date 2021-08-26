import { useState } from 'react';


const EditEnvelope = ({onEdit}) => {
    const [id, setId] = useState('')
    const [title, setText] = useState('')
    const [budget, setBudget] = useState('')       

    const onSubmit = (e) => {
        e.preventDefault()

        if (!id || !title || !budget){
            alert('field(s) missing!')
            return
        }
       
        onEdit({id, title, budget})
        
        setId('')
        setText('')
        setBudget('')
    }



    return (
        <form className= 'edit-envelope' onSubmit={onSubmit}>
            <h2>Edit Envelope</h2>
            <div className='form-control'>
                <label>Envelope Id</label>
                <input type='number' placeholder='Add Id'
                value={id} onChange={(e) => setId(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Envelope</label>
                <input type='text' placeholder='Update Title'
                value={title} onChange={(e) => setText(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Budget</label>
                <input type='float' placeholder='Update Budget'
                value={budget} onChange={(e) => setBudget(e.target.value)}/>
            </div>

            <input type="submit" value='Update Envelope'
                className='btn btn-block'/>
        </form>
    )
}

export default EditEnvelope
