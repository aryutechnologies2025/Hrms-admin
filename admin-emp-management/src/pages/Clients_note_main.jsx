import React from 'react'
import Sidebar from '../components/Sidebar'
import Client_note_details from './Client_note_details'

const Clients_note_main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Client_note_details/>
    </div>
  )
}

export default Clients_note_main