import { useState, useEffect } from 'react';
import Header from  './components/Header';
import Envelopes from './components/Envelopes';

import AddEnvelope from './components/AddEnvelope';
import EditEnvelope from './components/EditEnvelope';
import TransferBudget from './components/TransferBudget';



const App = () => {
  const [showAddEnvelope, setShowAddEnvelope] = useState(false)
  const [showEditEnvelope, setShowEditEnvelope] = useState(false)
  const [showTransferBudget, setShowTransferBudget] = useState(false)
  const [envelopes, setEnvelopes] = useState([])
  

  //Add Envelope
  const addEnvelope = async (envelope) => {
    const res = await fetch('https://personal-budget-z.herokuapp.com/api/envelopes', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(envelope),
    })

    const {data} = await res.json()
    setEnvelopes([...envelopes, data])
  }

  //Edit Envelope
  const editEnvelope = async (updatedEnvelope) => {
    const res = await fetch(`https://personal-budget-z.herokuapp.com/api/envelopes/${updatedEnvelope.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedEnvelope),
    })

    if (res.status === 400){
      alert('New budget is below current total expneses! Failed to update.')
    } else {const {data} = await res.json()
    setEnvelopes(
      envelopes.map((envelope) => 
      envelope.id === parseInt(updatedEnvelope.id) ? data : envelope
      )
    )}
  }

  //transfer budget
  const transferBudget = async({from, to, amount}) => {
    const res = await fetch(`https://personal-budget-z.herokuapp.com/api/envelopes/${from}/transfer/${to}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({from, to, amount})
    })

    if (res.status === 400){
      alert("Not enough budget to transfer.")
    } else {setEnvelopes(
      envelopes.map((envelope) => {
        if (envelope.id === parseInt(from)){
            envelope.budget -= parseInt(amount);
            return envelope;
          } 
          else if (envelope.id === parseInt(to)){
            envelope.budget += parseInt(amount);
            return envelope;
          } 
          else {
            return envelope;
          }
      })
    )}
  }

  useEffect(() => {
    const getEnvelopes = async () => {
      const envelopesFromServer = await fetchEnvelopes()
      setEnvelopes(envelopesFromServer)
    }

    getEnvelopes()
  }, [])

  //fetch envelopes
  const fetchEnvelopes = async () => {
    const res = await fetch('https://personal-budget-z.herokuapp.com/api/envelopes')
    const {data} = await res.json()
    console.log(data)
    return data
  }

  //delete envelope
    const deleteEnvelope = async (id) => {
      const res = await fetch(`https://personal-budget-z.herokuapp.com/api/envelopes/${id}`, {
        method: 'DELETE',
      })

      res.status === 204 ? setEnvelopes(envelopes.filter((envelope) => envelope.id !== id))
      : alert('Error Deleting This Envelope')
    }

  return (
    <div className = "container">
      <Header 
        onAdd={() => setShowAddEnvelope(!showAddEnvelope)}
        showAddEnvelope={showAddEnvelope}
        
        onEdit={() => setShowEditEnvelope(!showEditEnvelope)}
        showEditEnvelope={showEditEnvelope} 
        
        onTransfer={() => setShowTransferBudget(!showTransferBudget)}
        showTransferBudget={showTransferBudget} 
        />
      <p>The envelope budgeting system divides your income into
        <br /> different spending categories. Only spend what's available 
        <br /> in the envelopes. It prevents you from overspending!</p>

      {showAddEnvelope && <AddEnvelope onAdd={addEnvelope}/>}
      {showEditEnvelope && <EditEnvelope onEdit={editEnvelope}/>}
      {showTransferBudget && <TransferBudget onTransfer={transferBudget}/>}
      {envelopes.length > 0 ? <Envelopes envelopes={envelopes} 
      onDelete={deleteEnvelope} /> : 'No Envelopes to Show'}
    </div> 
  );
}

export default App;



