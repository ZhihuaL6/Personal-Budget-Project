import { useState } from 'react';


const AddTransaction = ({onAdd}) => {
    const [description, setText] = useState('')
    const [cost, setCost] = useState('')       

    const onSubmit = (e) => {
        e.preventDefault()

        if (!description || !cost){
            alert('Please add description or cost')
            return
        }
       
        onAdd({description, cost})

        setText('')
        setCost('')
    }



    return (
        <form className= 'add-transaction' onSubmit={onSubmit}>
            <h3>Add Expense</h3>
            <div className='form-control'>
                <label>Transaction</label>
                <input type='text' placeholder='Add description'
                value={description} onChange={(e) => setText(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Cost</label>
                <input type='float' placeholder='Add cost'
                value={cost} onChange={(e) => setCost(e.target.value)}/>
            </div>

            <input type="submit" value='Save Transaction'
                className='btn btn-block'/>
        </form>
    )
}

export default AddTransaction
