import { useState } from 'react';

const EditTransaction = ({transaction, onEdit}) => {
    const [id, setId] = useState('')
    const [description, setDetail] = useState('')
    const [cost, setCost] = useState('')       

    const onSubmit = (e) => {
        e.preventDefault()

        if (!id || !description || !cost){
            alert('field(s) missing!')
            return
        }
       
        onEdit({id, description, cost})

        setId('')
        setDetail('')
        setCost('')
    }



    return (
        <form className= 'edit-transaction' onSubmit={onSubmit}>
            <h3>Edit Expense</h3>
            <div className='form-control'>
                <label>Transaction Id</label>
                <input type='number' placeholder='Add Transaction Id'
                value={id} onChange={(e) => setId(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Description</label>
                <input type='text' placeholder='Add Description'
                value={description} onChange={(e) => setDetail(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Cost</label>
                <input type='float' placeholder='Update Cost'
                value={cost} onChange={(e) => setCost(e.target.value)}/>
            </div>

            <input type="submit" value='Update Transaction'
                className='btn btn-block'/>
        </form>
    )
}

export default EditTransaction
