import Transaction from "./Transaction"


const Transactions = ({transactions, onDelete}) => {
    return (
        <>
           {transactions.map((transaction) => (
              <Transaction key={transaction.id} 
              transaction={transaction}
              onDelete={onDelete} 
              
               />
          ))}   
        </>
    )
}

export default Transactions
