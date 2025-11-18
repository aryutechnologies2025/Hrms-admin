import React from 'react'
import Sidebar from '../components/Sidebar'
import ProjectList from '../components/project list/ProjectList'
import TaskList from '../components/taskList/TaskList'

const TaskListPage = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <TaskList className/>
    </div>
  )
}

export default TaskListPage