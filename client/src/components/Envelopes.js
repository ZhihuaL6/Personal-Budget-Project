import Envelope from "./Envelope"

const Envelopes = ({envelopes, onDelete}) => {
    return (
        <>
          {envelopes.map((envelope) => (
              <Envelope key={envelope.id} 
              envelope={envelope}
              onDelete={onDelete} 
               />
          ))}  
        </>
    )
}

export default Envelopes
