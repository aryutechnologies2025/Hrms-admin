import React from 'react'

import Sidebar from '../Sidebar'

import Bidding_transaction_details from './Bidding_transaction_details'

const Bidding_transaction_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Bidding_transaction_details/>
    </div>
  )
}

export default Bidding_transaction_main