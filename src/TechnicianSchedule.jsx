import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import moment from 'moment';
import { beforeAndAfterIndex, calculateStartTime, calculateWorkingHours, calculateWorkingHoursBeforeApiCall, findClosestTimeIndex, findIsthatTimeIsFree } from './CommonUtilsFunctions';

function TechnicianSchedule({ technicians, setTechnicians, data, setData }) {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    
    var tempTech = technicians;
    useEffect(() => {
        rerenderCalander();
    }, [technicians])

    useEffect(() => {
        const draggableEl = document.getElementById("external-events");
        const draggable = new Draggable(draggableEl, {
            itemSelector: ".fc-event",
            eventData: function (eventEl) {
                const title = eventEl.getAttribute("title");
                const id = eventEl.getAttribute("data");
                return {
                    title: title,
                    id: id
                };
            }
        });

        return () => {
            draggable.destroy();
        };
    }, []);



    function rerenderCalander() {
        var eventsList = [];
        tempTech.forEach(technician => {
            if (technician?.orders) {
                technician?.orders.forEach(order => {
                    const exists = eventsList.some((e) => {
                        return e.id == order.order.id
                    });
                    if (!exists) {
                        console.log(order.order.name, order.eventTime.startTime, technician.id);
                        eventsList.push({
                            title: order.order.name,
                            id: order.order.id,
                            start: order.eventTime.startTime,
                            end: order.eventTime.endTime,
                            resourceId: technician.id,
                            extendedProps: {
                                drivingTime: order.distanceDetails.duration.text,
                                drivingDistance: order.distanceDetails.distance.text,
                                TimeToComplete: order.order.TimeToComplete,
                                breakTime: breaktime(moment.duration({
                                    hours: order.order.TimeToComplete,
                                    seconds: order.distanceDetails.duration.value
                                  }).asMinutes() / 120 * 15),
                                location : order.order.location
                            }
                        })
                    }
                });
            }
        });
        setEvents(eventsList);
    }

    function calculateLeftHours(tech){
        var t = tempTech.filter(i => i.id == tech.id)[0]
        return `No of Jobs : ${t.orders.length}` 
    }

    function breaktime (time){
       return `${parseInt(time)} minutes`;
    }

    function renderEventContent(eventInfo) {
        return (
            <>
                <div className='text-center'>{eventInfo.event.title}</div>
                <div className='bg-blue-400 p-1'>
                    <div className='text-xs'>Job hours : {eventInfo.event.extendedProps.TimeToComplete} Hour</div>
                    <div className='text-xs'>Driving Time : {eventInfo.event.extendedProps.drivingTime}</div>
                    <div className='text-xs'>Driving Distance : {eventInfo.event.extendedProps.drivingDistance}</div>
                    <div className='text-xs'>Break Time : {eventInfo.event.extendedProps.breakTime}</div>
                </div>
            </>
        );
    }


    const handleEventDrop = (eventDropInfo) => {
        const { event, oldResource, newResource } = eventDropInfo;
        const oldResourceId = oldResource?.id;
        const newResourceId = newResource?.id;
        var newStartTime = event.start?.toISOString();
        const orderID = event.id;
        newStartTime = moment(newStartTime).utcOffset('+05:30').format();
        if (!oldResourceId) {
            updateOrders(orderID, event._def.resourceIds[0], newStartTime, event._def.resourceIds[0], eventDropInfo)
        } else {
            removeOrder(orderID, oldResourceId);
            updateOrders(orderID, newResourceId, newStartTime, oldResourceId, eventDropInfo)
        }
    };

    function removeOrder(orderID, oldResourceId) {
        const updatedTechnicians = tempTech.map((technician) => {
            if (technician.id == oldResourceId) {
                const updatedOrders = technician.orders.filter((order) => order.order.id != orderID);
                return {
                    ...technician,
                    orders: updatedOrders
                };
            }
            return technician;
        });
        tempTech = updatedTechnicians;
    }

    function updateEvent(info) {

        var newStartTime = info.event.start?.toISOString();
        var currentOrder = data.filter(order => order.id == info.event.id)
        const currentTech = technicians.filter(i => i.id == info.event._def.resourceIds[0]);

        if (!currentTech[0].leave &&
            currentTech[0].trained == currentOrder[0].serviceOn &&
            calculateWorkingHoursBeforeApiCall(currentTech[0], currentOrder[0])// technician?.workedHours | 0
        ) {
            var allStartTime = currentTech[0].orders.map(i => {
                return i.order.startTime
            })

            var { beforeIndex, afterIndex } = beforeAndAfterIndex(allStartTime, newStartTime);
            var locationDataBefore = currentTech[0].orders[beforeIndex]?.order?.location
            var orderDataAfter = currentTech[0].orders[afterIndex]?.order;
            if (!locationDataBefore) {
                locationDataBefore = currentTech[0].location;
            }
            initMap(locationDataBefore, currentOrder[0].location, currentOrder[0], currentTech[0], newStartTime, orderDataAfter, true);
        } else {
            info.revert();
        }

    }


    function updateOrders(orderID, newResourceId, newStartTime, oldResourceId, eventDropInfo) {

        // const targetMoment = moment(i.endTime);
        // const currentMoment = moment();
        const currentTech = technicians.filter(i => i.id == newResourceId);
        const oldTech = technicians.filter(i => i.id == oldResourceId);
        var currentOrder = oldTech[0].orders.filter((order) => order.order.id == orderID);



        if (!currentTech[0].leave &&
            currentTech[0].trained == currentOrder[0].order.serviceOn &&
            calculateWorkingHoursBeforeApiCall(currentTech[0], currentOrder[0].order)// technician?.workedHours | 0
        ) {
            var allStartTime = currentTech[0].orders.map(i => {
                return i.order.startTime
            })

            var { beforeIndex, afterIndex } = beforeAndAfterIndex(allStartTime, newStartTime);
            var locationDataBefore = currentTech[0].orders[beforeIndex]?.order?.location
            var orderDataAfter = currentTech[0].orders[afterIndex]?.order;
            if (!locationDataBefore) {
                locationDataBefore = currentTech[0].location;
            }
            initMap(locationDataBefore, currentOrder[0].order.location, currentOrder[0].order, currentTech[0], newStartTime, orderDataAfter, true)
        } else {
            eventDropInfo.revert();
        }

    }


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
    

    const initMap = async (employeeLocation, orderLocation, orderDetails, tech, newStartTime, orderDataAfter, type) => {
        const geocoder = new google.maps.Geocoder();
        const service = new google.maps.DistanceMatrixService();

        const request = {
            origins: [employeeLocation],
            destinations: [orderLocation],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
        };


        await service.getDistanceMatrix(request).then((response) => {
            const getDistance = response.rows[0].elements[0];
            console.log(calculateWorkingHours(tech, orderDetails), orderDetails.name, " >>>>> ", findIsthatTimeIsFree(tech, orderDetails, getDistance, newStartTime));
            if (calculateWorkingHours(tech, orderDetails) && findIsthatTimeIsFree(tech, orderDetails, getDistance, newStartTime)) {
                if (type) {
                    if (orderDataAfter) {
                        removeOrder(orderDataAfter.id, tech.id);
                    }

                    handleUpdateTechnicianOrders(tech.id, { "distanceDetails": getDistance, "order": orderDetails, eventTime: calculateStartTime(orderDetails, getDistance, newStartTime) });
                    handleUpdateorders(orderDetails.id);

                    if (orderDataAfter) {
                        var utech = tempTech.filter(i => i.id == tech.id);
                        initMap(orderLocation, orderDataAfter.location, orderDataAfter, utech[0]);
                    }

                } else {
                    handleUpdateTechnicianOrders(tech.id, { "distanceDetails": getDistance, "order": orderDetails, eventTime: calculateStartTime(orderDetails, getDistance) });
                    handleUpdateorders(orderDetails.id);
                }

                setTechnicians(tempTech)
            }
        })

    }


    const handleUpdateTechnicianOrders = (id, newOrder) => {
        var orders = tempTech.map(technician => {
            if (technician.id === id) {
                return { ...technician, orders: [...technician.orders, newOrder] };
            }
            return technician;
        });

        tempTech = orders;
    };


    const resourceRender = (info) => {
        // customize the rendering of the resource here
        const resourceEl = info.el;
        const resource = info.resource;
    
        // update the resource template
        const template = `
          <div class="fc-resource-custom-field">${calculateLeftHours(resource)}</div>
        `;
        resourceEl.innerHTML = template;
      };


    return (
        <div className="w-screen m-5 flex  gap-3">
            <div className='w-5/6'>
                <FullCalendar
                    plugins={[timeGridPlugin, resourceTimelinePlugin, interactionPlugin]}
                    initialView="resourceTimelineDay"
                    resources={technicians}
                    events={events}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
                    }}
                    slotDuration="00:15:00"
                    nowIndicator={true}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    allDaySlot={false}
                    eventClick={(event) => console.log(event.event.title)}
                    eventAdd={(event) => setEvents([...events, event.event.toPlainObject()])}
                    resourceLabelText="technician"
                    resourceAreaWidth="15%"
                    startEditable={false}
                    eventContent={renderEventContent}
                    eventDrop={handleEventDrop}
                    
                    eventReceive={updateEvent}
                    ref={calendarRef}
                />
            </div>
            <div
                id="external-events"
                className='w-1/6 p-2 shadow-sm bg-white rounded-md'
            >
                <p align="center">
                    <strong> Orders</strong>
                </p>
                {data.map(event => (
                    !event.processed ?
                       <div className='bg-blue-500 rounded-sm m-3' key={event.id} > <div
                            className="fc-event shadow-sm text-center rounded-sm text-white cursor-pointer"
                            title={event.name}
                            data={event.id}
                            key={event.id}
                        >
                           <a target="_blank" href={`https://maps.google.com/?q=${event.location.lat},${event.location.lng}`}>{event.name}</a> 
                        </div>
                        <div className='bg-blue-400 p-1'>
                        <div className='text-xs text-white'>Service On : {event.serviceOn}</div>
                        <div className='text-xs text-white'>Time To Complete : {event.TimeToComplete} hours</div>
                        </div>
                        </div>
                        : ''
                ))}
                
            </div>
        </div>
    );
}

export default TechnicianSchedule;
