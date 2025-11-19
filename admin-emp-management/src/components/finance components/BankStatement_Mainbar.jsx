import React from 'react'
import Sidebar from '../Sidebar'
import BankStatement_Detail from './BankStatement_Detail'

const BankStatement_Mainbar = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <BankStatement_Detail />
    </div>
  )
}

export default BankStatement_Mainbar
