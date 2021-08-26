import { FaTimes } from 'react-icons/fa'
import Button from './Button'
import { useState, useEffect} from 'react';
import Transactions from './Transactions';
import AddTransaction from './AddTransaction';
import EditTransaction from './EditTransaction'
import UsageBar from './UsageBar';



const Envelope = ({envelope, onDelete, onClick, onAdd}) => {
    const [transactions, setTransactions] = useState([])
    const [showTransactions, setShowTransactions] = useState(false)
    const [showAddTransaction, setShowAddTransaction] = useState(false)
    const [showEditTransaction, setShowEditTransaction] = useState(false)

    
    useEffect(() => {
      const getTransactions = async () => {
      const transactionsFromServer = await fetchTransactions()
      setTransactions(transactionsFromServer)
    }
  
      getTransactions()
    }, [])

    //fetch transactions
      const fetchTransactions = async () => {
        const res = await fetch(`https://personal-budget-z.herokuapp.com/api/transactions/envelope/${envelope.id}`)
        if (res.status !== 200){
              return []
          } else {
              const {data} = await res.json()
              return data
              }  
          }

    //add transaction
      const addTransaction = async (transaction) => {
        transaction.cost = parseFloat(transaction.cost)
        transaction.envelope_id = await envelope.id;
        const res = await fetch('https://personal-budget-z.herokuapp.com/api/transactions', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(transaction),
        })

        if (res.status === 400){
          alert('Exceeding Budget! Failed to add.');
        } else {
          const {data} = await res.json()
          setTransactions([...transactions, data])
       }
     }

    //edit transaction
      const editTransaction = async (updatedTransaction) => {
        updatedTransaction.envelope_id = await envelope.id;
         const res = await fetch(`https://personal-budget-z.herokuapp.com/api/transactions/${updatedTransaction.id}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(updatedTransaction),
        })
        if (res.status === 400){
          alert('Exceeding Budget! Failed to update.');
        } else {
          const data = await fetchTransactions()
          setTransactions(data)
        }
      }



    //delete envelope
      const deleteTransaction = async (id) => {
        const res = await fetch(`https://personal-budget-z.herokuapp.com/api/transactions/${id}`, {
          method: 'DELETE',
        })

        res.status === 204 ? setTransactions(transactions.filter((transaction) => transaction.id !== id))
        : alert('Error Deleting This Envelope')
      }
    //assign total cost in current envelop
    let totalCost = transactions.reduce(function (acc, obj) { return acc + obj.cost; }, 0);


    return (
        <div className='envelope'>
            <h3>
                {envelope.title} 
                <div>
                <Button color={showTransactions ? 'red' :'gold'} text ={showTransactions ? 'Collapse': 'Expand'} onClick={() => setShowTransactions(!showTransactions)}
                showTransactions={showTransactions} />

                <Button color={showAddTransaction ? 'red' : 'limegreen'} 
                    text={showAddTransaction ? 'Close' : 'Add Expense'} 
                    onClick={() => setShowAddTransaction(!showAddTransaction)}
                    showAddTransaction={showAddTransaction}/> 

                <Button color={showEditTransaction ? 'red': 'deepskyblue'} 
                    text={showEditTransaction ? "Close" : 'Edit Expense'} 
                    onClick={() => setShowEditTransaction(!showEditTransaction)}
                    showEditTransaction={showEditTransaction}/>

                <FaTimes style={{ color: 
                    'red', cursor: 'pointer'}} 
                    onClick={() => onDelete(envelope.id)}
                    />
                    </div>
            </h3>
            <p> {`Envelope Id: ${envelope.id}`} </p>
            <p> {`Budget: $${envelope.budget}`}</p>
            <UsageBar value={totalCost} max={envelope.budget}/>
            <p>{`${(totalCost/envelope.budget*100).toFixed(2)}% Used :   $${(envelope.budget - totalCost).toFixed(2)} Remaining`}</p>
            
            {showAddTransaction && <AddTransaction onAdd={addTransaction}/>}
            {showEditTransaction && <EditTransaction onEdit={editTransaction}/>}
            {showTransactions ? transactions.length > 0 ? <Transactions 
                transactions={transactions} onDelete={deleteTransaction} onClick={onClick} 
                /> : <h4>No transactions</h4> : ''}
        </div>
    )
}


      

export default Envelope
