import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (    
    <nav className="bg-[#0033a1] m-5 p-5 w-full h-16 rounded-lg text-white shadow-md flex flex-col md:flex-row items-center justify-between">
      <h4 className=" text-sm font-bold bg-white py-1 px-4 text-[#D74E0F] rounded-lg">Job Scheduler</h4>
      <div className=" flex justify-between cursor-pointer">
        <NavLink end to="/" className="mx-3 text-sm"> Job List</NavLink>
        <NavLink end to="/TechnicianSchedule" className="mx-3 text-sm"> Technician Schedule</NavLink>
      </div>
      <div className=" flex justify-end items-center">
        <div className="flex flex-col mx-2 items-center">
          <div className="mx-3 text-sm">1000120</div>
          <div className="mx-3 text-sm">Admin</div>
        </div>
        <div className="bg-[#D74E0F] p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </div>
      </div>
    </nav>
  )
}
