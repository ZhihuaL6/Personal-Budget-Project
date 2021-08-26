import React from 'react'
import Button from './Button'



const Header = ({onAdd, onEdit, onTransfer, showAddEnvelope, showEditEnvelope, showTransferBudget}) => {
    return (
        <header className = 'header'>
            <h1>Personal Budget Tool</h1>
            <h3>
            {showEditEnvelope || showTransferBudget ? '' : <Button color={showAddEnvelope ? 'red' : 'limegreen'} 
            text={showAddEnvelope ? 'Close' :'Add Envelope'} onClick={onAdd} />}

            {showAddEnvelope || showTransferBudget ? '': <Button color={showEditEnvelope ? 'red' : 'deepskyblue'} 
            text={showEditEnvelope ? 'Close' : 'Edit Envelope'} onClick={onEdit} />}
            
            {showAddEnvelope || showEditEnvelope ? '': <Button color={showTransferBudget ? 'red' : 'limegreen'} 
            text={showTransferBudget ? 'Close' : 'Transfer Budget'} onClick={onTransfer}/>}
            </h3>
        </header>
    )
}

export default Header
