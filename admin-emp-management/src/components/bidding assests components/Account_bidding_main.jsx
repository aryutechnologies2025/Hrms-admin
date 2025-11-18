import React from 'react'

import Account_bidding_details from './Account_bidding_details'
import Sidebar from '../Sidebar'

const Account_bidding_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Account_bidding_details/>
    </div>
  )
}

export default Account_bidding_main