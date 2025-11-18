import React from 'react'
import Sidebar from "../Sidebar"
import AssetCategory_Details from './AssetCategory_Details'

const AssetCategory_mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>
      
      <AssetCategory_Details />
    </div>
  )
}

export default AssetCategory_mainbar
