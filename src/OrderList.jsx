import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { order } from './assets/JSON/json';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import TechnicianSchedule from './TechnicianSchedule';
import { calculateWorkingHoursBeforeApiCall, findClosestTimeIndex } from './CommonUtilsFunctions';
const OrderList = ({ technicians, setTechnicians, data, setData }) => {
  let navigate = useNavigate();

  /* Table Code Start */

  const [loading, setLoader] = useState(false);
  const [filter, setFilter] = useState('');
  var tempTechnicians = technicians;
  var filtredTechnicians = '';
  const handleFilter = (e) => {
    setFilter(e.target.value);
  };
  const filteredData = data.filter((d) => {
    return (
      d.name.toLowerCase().includes(filter.toLowerCase()) ||
      d.id.toString().includes(filter) ||
      d.serviceOn.toLowerCase().includes(filter.toLowerCase()) ||
      d.TimeToComplete.toString().includes(filter)
    );
  });
  const locationTemplate = (rowData) => {
    return <a target="_blank" href={`https://maps.google.com/?q=${rowData.location.lat},${rowData.location.lng}`}><i title={`${rowData.location.lat},${rowData.location.lng}`} className='pi pi-map'></i></a>;
  }

  const processFlag = (rowData) => {
    return !rowData.processed ? <div className='bg-red-500 h-4 w-4 rounded-full'></div> : <div className='bg-green-500 h-4 w-4 rounded-full'></div>
  }

  /* Table Code End */

  const handleUpdateTechnicianOrders = (id, newOrder) => {
    //setTechnicians(technicians => {
    var orders = tempTechnicians.map(technician => {
      if (technician.id === id) {
        return { ...technician, orders: [...technician.orders, newOrder] };
      }
      return technician;
    });
    tempTechnicians = orders;
    //console.log(orders, tempTechnicians);
    //});
  };

  const handleUpdateTechnicianLocation = (id, newlocation) => {
    //setTechnicians(technicians => {
    var location = tempTechnicians.map(technician => {
      if (technician.id === id) {
        return { ...technician, location: newlocation[0] };
      }
      return technician;
    });
    tempTechnicians = location;
    //console.log(location, tempTechnicians);
    // });
  };


  const handleUpdateorders = (id) => {
    setData(orders => {
      return orders.map(order => {
        if (order.id === id) {
          return { ...order, processed: true };
        }
        return order;
      });
    });
  };

  const calculateWorkingHours = (technician, orderDetails) => {
    var time = 0;
    var drivingTime = 0;
    // technician total working time for the day
    var technicianWorkingTime = (parseFloat(technician.workingHours) * 60) * 60;

    // technician total driving time for the day
    var technicianDrivingTime = (parseFloat(technician.drivingTime) * 60) * 60;

    // Add current order time
    time = (parseFloat(orderDetails.TimeToComplete) * 60) * 60;

    // Adding already asiggned time
    technician.orders.map(i => {
      time += i.distanceDetails.duration.value;
      time += (parseFloat(i.order.TimeToComplete) * 60) * 60;
      drivingTime += i.distanceDetails.duration.value;
    });

    if (time <= technicianWorkingTime)
      return true;
    else
      return false;

  }


  const initMap = async (orderLocation, employeeLocation, orderDetails) => {
    const geocoder = new google.maps.Geocoder();
    const service = new google.maps.DistanceMatrixService();

    const request = {
      origins: orderLocation,
      destinations: employeeLocation,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };


    await service.getDistanceMatrix(request).then((response) => {
      const getDistance = response.rows[0].elements;
      getDistance.map((a, b) => a['id'] = b);
      getDistance.sort(function (a, b) {
        return a.duration.value - b.duration.value;
      });

      //const minDuration = Math.min(...getDistance.map(item => item.duration.value));
      var closestTechnicianIndex = null;
      var distanceDetails = '';
      getDistance.forEach(element => {
        if (closestTechnicianIndex == null && calculateWorkingHours(filtredTechnicians[element.id], orderDetails) && findIsthatTimeIsFree(filtredTechnicians[element.id], orderDetails,element)) {
          closestTechnicianIndex = element.id;
          distanceDetails = element;
        }
      });



      //getDistance.findIndex(item => item.duration.value === minDuration);
      const closestTechnician = filtredTechnicians[closestTechnicianIndex];
      if (!closestTechnician.orders.includes({ "distanceDetails": distanceDetails, "order": orderDetails , eventTime: calculateStartTime(orderDetails, distanceDetails)})) {
        handleUpdateTechnicianOrders(closestTechnician.id, { "distanceDetails": distanceDetails, "order": orderDetails, eventTime: calculateStartTime(orderDetails, distanceDetails) });
        //handleUpdateTechnicianLocation(closestTechnician.id, orderLocation);
        handleUpdateorders(orderDetails.id);
        filteredData('');
      }
    });
  };

  const findIsthatTimeIsFree = (technician, orderDetails, distanceDetails) => {
    const startTime = moment(orderDetails.startTime).subtract(distanceDetails.duration.value, 'seconds').format();
    const endTime = moment(orderDetails.startTime).add(orderDetails.TimeToComplete, 'hours').add((((distanceDetails.duration.value+((orderDetails.TimeToComplete *60)*60))/7200)*900),'seconds').format();
   var tech = tempTechnicians.filter(i=> i.id == technician.id)[0];
    if (tech.orders.length) {
        const flag = tech.orders.map(element => {
            return areTimeRangesOverlapping([startTime, endTime], [element.eventTime.startTime, element.eventTime.endTime]);
        });
        return flag.filter(element => element).length ? false : true;
    } else
        return true

}

function areTimeRangesOverlapping(time1, time2) {
  const start1 = new Date(time1[0]);
  const end1 = new Date(time1[1]);
  const start2 = new Date(time2[0]);
  const end2 = new Date(time2[1]);

  for (let i = 0; i < 1; i++) {
    if (start1 < end2 && end1 > start2) {
      return true; // time ranges are overlapping
    }
    else {
      break; // time ranges are not overlapping, exit the loop
    }
  }

  return false; // time ranges are not overlapping
}

  function calculateStartTime(orderDetails, distanceDetails) {
    const startTime = moment(orderDetails.startTime).subtract(distanceDetails.duration.value, 'seconds').format();
    const endTime = moment(orderDetails.startTime).add(orderDetails.TimeToComplete, 'hours').add((((distanceDetails.duration.value+((orderDetails.TimeToComplete *60)*60))/7200)*900),'seconds').format();
    return {startTime: startTime , endTime:endTime};
  }


  function getScheduleByMonthWeekDaysTime(data) {

    const years = [data.year];
    const months = data.month;
    const weeks = data.week;
    const days = data.days;
    const time = data.time;
    const timezone = "+05:30"; // Set the timezone here

    const schedule = [];

    for (const year of years) {
      for (const month of months) {
        for (const week of weeks) {
          for (const day of days) {
            const startOfWeek = moment().year(year).month(month - 1).date(1).add(week - 1, 'weeks').day(day).toDate();
            const startTime = moment(startOfWeek).hour(time[0]).minute(0).second(0).format();
            const endTime = moment(startOfWeek).hour(time[time.length - 1]).minute(59).second(0).format();
            schedule.push({ startTime, endTime });
          }
        }
      }
    }
    return schedule;
  }

  function updateOrderSchedule(orders) {
    orders.forEach(order => {
      const schedule = getScheduleByMonthWeekDaysTime(order.date);
      order.exactDate = schedule;
    });
    return orders;
  }

  useEffect(() => {
    const updatedOrders = updateOrderSchedule(order);
    updatedOrders.sort(sortByStartDate);
  }, [order]);

  function sortByStartDate(a, b) {
    const aStartDate = moment(a.exactDate[0].startTime);
    const bStartDate = moment(b.exactDate[0].startTime);

    if (aStartDate.isBefore(bStartDate)) {
      return -1;
    } else if (bStartDate.isBefore(aStartDate)) {
      return 1;
    } else {
      return 0;
    }
  }





  function findLastLocation(technician, orderItem, index) {

    var locationData = '';
    var orderFlag = false;
    orderItem.exactDate.map(i => {
      const targetMoment = moment(i.endTime);
      const currentMoment = moment();

      if (!currentMoment.isAfter(targetMoment) && !orderFlag) {
        orderFlag = true;
        if (technician.orders.length) {
          technician.orders.map(i => {
            var allStartTime = technician.orders.map(i =>{
              return i.order.startTime
            })
            locationData = technician.orders[findClosestTimeIndex(allStartTime,orderItem.startTime)].order.location
          })
        }
        else
          locationData = technician.location
        order[index].startTime = i.startTime;
        order[index].endTime = i.endTime;
      }
    })
    return locationData;
  }

  

  const process = async () => {
    setLoader(true);
    filtredTechnicians = []
    for (const [index, orderItem] of order.entries()) {
      
      const employeeLocations = tempTechnicians.map(technician => {

        /**
           * Checking Leave
           * Checking Trained Company
           * Checking total Working Hours
           * Checking if already processed or not
        */

        if (!technician.leave &&
          technician.trained == orderItem.serviceOn
          && !orderItem.processed &&
          calculateWorkingHoursBeforeApiCall(technician, orderItem)// technician?.workedHours | 0
        ) {
          filtredTechnicians.push(technician)
          return findLastLocation(technician, orderItem, index);

        } else
          return;
      });
      const orderLocation = [orderItem.location];
      try {
        console.log('================employeeLocations====================');
        console.log(employeeLocations);
        console.log('====================================');
        const empLocation = employeeLocations.filter(item => item !== undefined && item !== "");
        if (empLocation.length)
          await initMap(orderLocation, empLocation, orderItem);
      } catch (error) {
        setLoader(false);
      }
    }

    setTechnicians(tempTechnicians);

    console.log('====================================');
    console.log(tempTechnicians);
    console.log('====================================');
   navigate('/TechnicianSchedule');
  };

  return (
    <div className="rounded-md relative w-full shadow-2xl bg-white mx-5">
      <div className="card-header">
        <div className="head-label"><h6 className="mb-0">Job List</h6></div>
        <button onClick={() => process()} className='bg-[#D74E0F] hover:bg-[#D74E0F] text-white font-semibold hover:text-white py-2 px-4 border border-[#D74E0F] hover:border-transparent rounded'> {loading ? <i className="pi pi-spin pi-spinner"></i> : <i className='pi pi-calendar-plus'></i>} {loading ? " " : "Process"}</button>
      </div>
      <div className="flex justify-between p-3">
        <button onClick={() => setFilter(filter => '')} className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'><i className='pi pi-filter'></i> Clear</button>
        <InputText
          className=' h-10'
          type="text"
          placeholder="Filter by all fields"
          value={filter}
          onChange={handleFilter}
        />
      </div>
      <div className='p-3'>
        <DataTable value={filteredData} size="small" stripedRows responsiveLayout="scroll" sortMode="multiple" paginator
          paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          rowsPerPageOptions={[10, 20, 50]} currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10}>
          <Column field="id" header="Id" sortable />
          <Column field="name" header="Name" sortable />
          <Column field="serviceOn" header="Company Name" sortable />
          <Column field="TimeToComplete" header="Time To Complete" sortable />
          <Column field="processed" header="Assigned" body={processFlag} sortable />
          <Column field="location" header="Location" body={locationTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default OrderList;
