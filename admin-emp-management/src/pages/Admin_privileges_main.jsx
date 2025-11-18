import React from 'react'
import Sidebar from '../components/Sidebar'
import Link_details from './Link_details'
import AddLinks_details from './AddLinks_details'
import { AdminPrivileges } from './AdminPrivileges'

const Admin_privileges_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>

     <AdminPrivileges/>
    </div>
  )
}

export default Admin_privileges_main