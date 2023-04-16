import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { calculateWorkingHoursBeforeApiCall, findClosestTimeIndex } from './CommonUtilsFunctions';

function TechnicianSchedule({ technicians, setTechnicians }) {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        var eventsList = events;
        console.log('===========technicianstechnicianstechnicianstechnicianstechnicians=========================');
        console.log(technicians);
        console.log('====================================');
        technicians.forEach(technician => {
            if (technician?.orders) {
                technician?.orders.forEach(order => {

                    const exists = eventsList.some((e) => {
                        return e.id == order.order.id
                    });

                    if (!exists)
                        eventsList.push({
                            title: order.order.name,
                            id: order.order.id,
                            start: order.eventTime.startTime,
                            end: order.eventTime.endTime,
                            resourceId: technician.id,
                            extendedProps: {
                                description: order.order.name + ">>",
                            }
                        })
                });
            }
        });
        setEvents(eventsList);

    }, [technicians])


    function renderEventContent(eventInfo) {
        // console.log('====================================');
        // console.log(eventInfo);
        // console.log('====================================');
        return (
            <>
                <b>{eventInfo.event._def.extendedProps.description}</b>
                <i>{eventInfo.event.title}</i>
            </>
        );
    }


    const handleEventDrop = (eventDropInfo) => {
        const { event, oldResource, newResource, start } = eventDropInfo;
        const oldResourceId = oldResource?.id;
        const newResourceId = newResource?.id;
        const newStartTime = event.start?.toISOString();
        const orderID = event.id;
        console.log('Old Resource ID:', oldResourceId);
        console.log('New Resource ID:', newResourceId);
        console.log('New Start Time:', newStartTime, event.id);

        if (!oldResourceId) {

        } else {
            removeOrder(orderID, oldResourceId);
            updateOrders(orderID, newResourceId, newStartTime)
        }

    };

    function removeOrder(orderID, oldResourceId) {
        const updatedTechnicians = technicians.map((technician) => {
            if (technician.id == oldResourceId) {
                const updatedOrders = technician.orders.filter((order) => order.order.id != orderID);
                return {
                    ...technician,
                    orders: updatedOrders
                };
            }
            return technician;
        });
        setTechnicians(updatedTechnicians);
    }


    function updateOrders(orderID, newResourceId, newStartTime) {

       // const targetMoment = moment(i.endTime);
       // const currentMoment = moment();
        const currentTech = technicians.filter(i=>i.id == newResourceId);
        const currentOrder = currentTech.orders.filter((order) => order.order.id == orderID);
       
        if (!currentTech[0].leave &&
            currentTech[0].trained == currentOrder[0].serviceOn &&
            calculateWorkingHoursBeforeApiCall(currentTech[0], currentOrder[0])// technician?.workedHours | 0
          ) {
            var allStartTime = currentTech[0].orders.map(i =>{
                return i.order.startTime
              })
            var locationDataBefore = currentTech[0].orders[findClosestTimeIndex(allStartTime,newStartTime)].order.location
            var locationDataAfter = currentTech[0].orders[findClosestTimeIndex(allStartTime,newStartTime,'after')].order.location
            console.log('================locationData====================');
            console.log(locationDataBefore,locationDataAfter);
            console.log('====================================');

          }




        // if (!currentMoment.isAfter(targetMoment)){
        //     console.log('====================================');
        //     console.log();
        //     console.log('====================================');
        // }

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

            if(calculateWorkingHours(filtredTechnicians[element.id], orderDetails) && findIsthatTimeIsFree(filtredTechnicians[element.id], orderDetails,element)){

            }
        })

    }


    return (
        <div className="w-screen m-5">
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
                eventClick={(event) => alert(event.event.title)}
                eventAdd={(event) => setEvents([...events, event.event.toPlainObject()])}
                resourceLabelText="technician"
                resourceAreaWidth="15%"
                startEditable={false}
                eventContent={renderEventContent}
                eventDrop={handleEventDrop}
            />
        </div>
    );
}

export default TechnicianSchedule;
