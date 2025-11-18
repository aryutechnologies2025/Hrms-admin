import React from 'react'
import Sidebar from '../components/Sidebar'
import ProjectList from '../components/project list/ProjectList'
import TaskListClient from '../components/taskList/TaskListClient.jsx'

const TaskListPage = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <TaskListClient />
    </div>
  )
}

export default TaskListPage