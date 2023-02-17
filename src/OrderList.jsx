import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { order } from './assets/JSON/json';
import { useNavigate } from 'react-router-dom';

const OrderList = ({ technicians, setTechnicians, data, setData , setDummyTechnicians ,dummyTechnicians}) => {
    let navigate = useNavigate();

    /* Table Code Start */

    const [loading, setLoader] = useState(false);
    const [filter, setFilter] = useState('');
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
        setTechnicians(technicians => {
            return technicians.map(technician => {
                if (technician.id === id) {
                    return { ...technician, orders: [...technician.orders, newOrder] };
                }
                return technician;
            });
        });
    };

    const handleUpdateTechnicianLocation = (id, newlocation) => {
        setTechnicians(technicians => {
            return technicians.map(technician => {
                if (technician.id === id) {
                    return { ...technician, location: newlocation[0] };
                }
                return technician;
            });
        });
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
            getDistance.forEach(element => {

                /**
                 * Checking Leave
                 * Checking Trained Company
                 * Checking total Working Hours
                 * Checking if already processed or not
                 */
                if (!technicians[element.id].leave &&
                    technicians[element.id].trained == orderDetails.serviceOn && calculateWorkingHours(technicians[element.id], orderDetails)
                        
                    //!orderDetails.processed//&& 
                    // technicians[element.id].workingHours < technicians[element.id].workedHours | 0
                ) {
                    closestTechnicianIndex = element.id;
                    return false;
                }

            });

           

            //getDistance.findIndex(item => item.duration.value === minDuration);
            const closestTechnician = technicians[closestTechnicianIndex];
            if (!closestTechnician.orders.includes({ "distanceDetails": getDistance[closestTechnicianIndex], "order": orderDetails })) {
                handleUpdateTechnicianOrders(closestTechnician.id, { "distanceDetails": getDistance[closestTechnicianIndex], "order": orderDetails });
                handleUpdateTechnicianLocation(closestTechnician.id, orderLocation);
                handleUpdateorders(orderDetails.id);
                filteredData('');
            }
        });
    };

    const calculateWorkingHours = (technician,orderDetails) => {
        console.log('================technician.orders====================');
        console.log(technician.orders);
        console.log('====================================');
        technician.orders
        return true;
    }

    const process = async () => {
        setLoader(true);
        for (const orderItem of order) {
            const employeeLocations = technicians.map(technician => technician.location);
            const orderLocation = [orderItem.location];
            try {
                await initMap(orderLocation, employeeLocations, orderItem);
            } catch (error) {
                setLoader(false);
            }
        }
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
