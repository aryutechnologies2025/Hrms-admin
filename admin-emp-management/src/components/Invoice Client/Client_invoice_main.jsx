import React from 'react'


import Sidebar from '../Sidebar'
import Client_invoice_details from './Client_invoice_details'

const Client_invoice_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Client_invoice_details/>
    </div>
  )
}

export default Client_invoice_main