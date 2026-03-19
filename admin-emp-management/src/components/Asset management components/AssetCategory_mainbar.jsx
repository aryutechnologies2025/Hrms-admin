import React from 'react'
import Sidebar from "../Sidebar"
import AssetCategory_details from './AssetCategory_details'

const AssetCategory_mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>
      
      <AssetCategory_details />
    </div>
  )
}

export default AssetCategory_mainbar
