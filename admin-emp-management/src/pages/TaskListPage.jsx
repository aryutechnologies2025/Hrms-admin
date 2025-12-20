import React from 'react'
import Sidebar from '../components/Sidebar'
import ProjectList from '../components/project list/ProjectList'
import TaskList from '../components/taskList/TaskListClient'


const TaskListPage = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <TaskList />
    </div>
  )
}

export default TaskListPage