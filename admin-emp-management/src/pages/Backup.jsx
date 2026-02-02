import React from 'react'
import Sidebar from '../components/Sidebar'
import Backup_Mainbar from '../components/backup components/Backup_Mainbar'

const Backup = () => {
  return (
     <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
      <Backup_Mainbar/>
    </div>
  )
}

export default Backup