import React from 'react'
import Sidebar from '../components/Sidebar'
import Expense_icome_details from './Expense_icome_details'
import Income_details from './Income_details'

const Income_main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Income_details/>
    </div>
  )
}

export default Income_main