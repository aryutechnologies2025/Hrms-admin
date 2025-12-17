import React from 'react'
import Sidebar from '../Sidebar'
import Slack_details from './Slack_details'
import Slack from './Slack'

const Slack_mainbar = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    {/* <Slack_details/> */}
    <Slack/>
    </div>
  )
}

export default Slack_mainbar