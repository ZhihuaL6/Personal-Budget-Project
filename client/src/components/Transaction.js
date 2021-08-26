import { FaTimes } from 'react-icons/fa'

const Transaction = ({transaction, onDelete}) => {
  

    return (
        <div className='transaction'>
            <h4>
                {`Transaction Id: ${transaction.id}`}
                    <FaTimes style={{ color: 
                    'blue', cursor: 'pointer'}} 
                    onClick={() => onDelete(transaction.id)}
                    />
            </h4>
            <p>{transaction.description}</p>
            <p>{`-Cost: $${transaction.cost}`}</p>
            <p>{`-${transaction.date.split("T").shift()}`} </p>           
        </div>
    )
}

export default Transaction
