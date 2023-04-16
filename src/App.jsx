import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import { employee, order } from './assets/JSON/json';
import TechnicianSchedule from './TechnicianSchedule';
import OrderList from './OrderList';

const App = () => {
  const [technicians, setTechnicians] = useState(employee);
  const [data, setData] = useState(order);
  return (<div className='bg-[#d6e3ff] h-screen overflow-auto flex flex-wrap w-full content-start'>
    <NavBar />
    <Routes>
      <Route exact path="/" element={<OrderList technicians={technicians}
        setTechnicians={setTechnicians}
        data={data} setData={setData} />} />
      <Route exact path="/TechnicianSchedule" element={<TechnicianSchedule technicians={technicians} setTechnicians={setTechnicians} data={data} setData={setData} />} />
    </Routes>
  </div>
  );
};

export default App;
