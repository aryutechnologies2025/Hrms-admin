import React from 'react'
import Sidebar from '../components/Sidebar'
import ProjectList from '../components/project list/ProjectList'

const ProjectListPage = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <ProjectList/>
    </div>
  )
}

export default ProjectListPage