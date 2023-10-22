import React, { useState } from 'react'
import './Bed.css'

export default function Bed(props) {

  return (
    <div>
        <button onClick={() => props.setSelectedBed(props.bed_id)} disabled={ false }>
            {<img src={props.occupantPhoto} alt='occupant-photo' className='photo'/>}{props.bed_id}
        </button>
    </div>
  )
}
