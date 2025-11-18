import React from 'react'
import Sidebar from '../components/Sidebar'
import AssetManagement_details from '../components/Asset management components/AssetManagement_details'

const AssetManagement_mainbar = () => {
  return (
    <div className='flex'>
        <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
        </div>
        
      <AssetManagement_details />
    </div>
  )
}

export default AssetManagement_mainbar
