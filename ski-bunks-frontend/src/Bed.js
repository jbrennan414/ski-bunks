import React from 'react'

export default function Bed(props) {

  return (
    <div>
        <button onClick={() => props.setSelectedBed(props.bed_id)} disabled={ false }>
            {props.isOccupied && <img src={`${props.occupantPhoto}`} />}{props.bed_id}
        </button>
    </div>
  )
}
