import React from 'react'
import Sidebar from '../components/Sidebar'
import Expense_icome_details from './Expense_icome_details'

const Expense_income_main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Expense_icome_details/>
    </div>
  )
}

export default Expense_income_main