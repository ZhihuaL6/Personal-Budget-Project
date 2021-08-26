import { useState } from 'react';

const TransferBudget = ({onTransfer}) => {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [amount, setAmount] = useState('')       

    const onSubmit = (e) => {
        e.preventDefault()

        if (!from || !to || !amount){
            alert('field(s) missing!')
            return
        }
       
        onTransfer({from, to, amount})
        
        setFrom('')
        setTo('')
        setAmount('')
    }

    return (
        <form className= 'transfer-budget' onSubmit={onSubmit}>
            <h2>Transfer Budget</h2>
            <div className='form-control'>
                <label>From Id</label>
                <input type='number' placeholder='Add From Id'
                value={from} onChange={(e) => setFrom(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>To Id</label>
                <input type='number' placeholder='Add To Id'
                value={to} onChange={(e) => setTo(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Transfer amount</label>
                <input type='float' placeholder='Transfer amount'
                value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>

            <input type="submit" value='Submit Transfer'
                className='btn btn-block'/>
        </form>
    )
}

export default TransferBudget
