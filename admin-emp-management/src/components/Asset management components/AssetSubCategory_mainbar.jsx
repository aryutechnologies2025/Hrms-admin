import React from 'react'
import Sidebar from '../Sidebar'
import AssetSubCategory_details from './AssetSubCategory_details'

const AssetSubCategory_mainbar = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
       <Sidebar />
      </div>
      <AssetSubCategory_details />
    </div>
  )
}

export default AssetSubCategory_mainbar
