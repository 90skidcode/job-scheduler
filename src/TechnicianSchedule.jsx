import React from 'react'

export default function TechnicianSchedule({ technicians }) {


    const GetRoute = (technician) => {
        var url = 'https://www.google.com/maps/dir/'
        var location = technician.location.lat + ',' + technician.location.lng + "/";
        technician.orders.forEach(element => {
            location += element.order.location.lat + ',' + element.order.location.lng + '/';
        });
        window.open(url + location);
    }

    const widthFinderFull = (order,distanceDetails) => {
        var time = 0;
        // Add current order time
        time = (parseFloat(order.TimeToComplete) * 60) * 60;

        // Adding already asiggned time
        time += distanceDetails.duration.value;
        return ((time/86400)*100).toFixed(2);
    }

    const widthFinderTravel = (order,distanceDetails) => {
        var time = distanceDetails.duration.value;
        return ((((time/86400)*100).toFixed(2)/(widthFinderFull(order,distanceDetails)/100))).toFixed(2);
    }

    const widthFinderOrder = (order,distanceDetails) => {
        var time = (parseFloat(order.TimeToComplete) * 60) * 60;
        return ((((time/86400)*100).toFixed(2)/(widthFinderFull(order,distanceDetails)/100))).toFixed(2);
    }

    return (
        <div className="rounded-md relative w-full shadow-2xl bg-white mx-5">
            <div className="card-header">
                <div className="head-label"><h6 className="mb-0">Technician Schedule</h6></div>
            </div>
            <div className="calendar-container bg-white p-2 flex flex-wrap border-b border-gray-200" >
                <div className="schedule w-1/12 cursor-pointer flex flex-col overflow-auto" >
                    <div className="rounded-lg   shadow-lg m-2 h-8 bg-orange-600 justify-center items-center flex text-center">

                        <h2 className="text-[8px] p-2 text-white">Technician List</h2>

                    </div>
                    {technicians.map((technician) => (
                        <div onClick={() => GetRoute(technician)} key={technician.id} className={technician.leave ? "bg-red-600 rounded-lg shadow-lg flex flex-col m-2 h-8" : "bg-green-600 flex flex-col rounded-lg shadow-lg m-2 h-8"} >
                            <div className={'rounded-lg mb-1 flex justify-center'}>
                                <h2 className="text-[8px] font-medium rounded-lg p-2 text-white">{technician.name}</h2>
                            </div>
                            <div className="px-2 py-1 flex flex-col  gap-3 justify-between hidden">
                                <div className="text-gray-600 mb-1 flex items-center gap-2 pr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <b className="text-[8px]  font-medium">{technician.trained}</b>
                                </div>
                            </div>
                            <div className="px-2 flex flex-row justify-between rounded-b-lg hidden">
                                <div className="text-gray-600 mb-1 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <b className="text-[8px]  font-medium">{technician.workingHours} </b>
                                </div>
                                <div className="text-gray-600 mb-1 py-1 flex items-center pr-2 gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                    <b className="text-[8px]  font-medium"> {technician.drivingTime}</b>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                <div className='w-11/12 pr-1 flex flex-col overflow-auto '>
                    <div className='flex flex-col'>
                        <div className=' rounded-lg shadow-lg m-2 h-8 bg-orange-600 justify-center items-center flex text-center'>
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24].map((i) => (
                                    <div className="border-r border-orange-500  justify-center items-center flex  shadow-xl w-[5%]">
                                        <h2 className="text-[8px] font-medium  p-2 ">{i}</h2>
                                    </div>
                                ))
                            }
                        </div>
                        {technicians.map((technician) => (
                            <div className=' flex flex-row m-2 h-8'>
                                {technician.orders.map(({ order, distanceDetails }) => (
                                    <div className='flex flex-row border-r-2 border-blue-500' style={{ width:`${widthFinderFull(order,distanceDetails)}%`}}>
                                        <div className='flex flex-row bg-yellow-300' style={{ width:`${widthFinderTravel(order,distanceDetails)}%`}}></div>
                                    <div className={`bg-blue-400 shadow-lg flex flex-col border-r border-blue-200`} style={{ width:`${widthFinderOrder(order,distanceDetails)}%`}} key={order.id}>
                                        <div className='mb-1 flex justify-center'>
                                            <h2 className="text-[8px] font-medium p-2 "><a className="text-[8px]" target="_blank" href={`https://maps.google.com/?q=${order.location.lat},${order.location.lng}`}>{order.name}</a></h2>
                                        </div>
                                        <div className="px-2 py-1 flex flex-row gap-3 justify-between hidden">
                                            <div className="text-gray-600 mb-1 flex items-center gap-2 pr-2 ">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <b className="text-[8px] font-medium">{order.serviceOn}</b>
                                            </div>
                                           
                                        </div>
                                        <div className="px-2 flex flex-row justify-between rounded-b-lg hidden  ">
                                            <div className="text-gray-600 mb-1 py-1 flex items-center pr-2  gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
                                                </svg>

                                                <b className="text-[8px]  font-medium">{distanceDetails.distance.text}</b>
                                            </div>
                                            <div className="text-gray-600 mb-1 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <b className="text-[8px] font-medium">{order.TimeToComplete}</b>
                                            </div>
                                            <div className="text-gray-600 mb-1 py-1 flex items-center  gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <b className="text-[8px]  font-medium">{distanceDetails.duration.text} Hours</b>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
