import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { beforeAndAfterIndex, calculateStartTime, calculateWorkingHours, calculateWorkingHoursBeforeApiCall, findClosestTimeIndex, findIsthatTimeIsFree } from './CommonUtilsFunctions';

function TechnicianSchedule({ technicians, setTechnicians }) {

    const [events, setEvents] = useState([]);
    var tempTech = technicians;
    useEffect(() => {
        rerenderCalander();
    }, [technicians])

    function rerenderCalander() {
        var eventsList = [];
        console.log('===========technicianstechnicianstechnicianstechnicianstechnicians=========================');
        console.log(technicians);
        console.log('====================================');
        technicians.forEach(technician => {
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
                                description: order.order.name + ">>",
                            }
                        })
                    }
                });
            }
        });
        setEvents(eventsList);
    }

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
        const { event, oldResource, newResource } = eventDropInfo;
        const oldResourceId = oldResource?.id;
        const newResourceId = newResource?.id;
        var newStartTime = event.start?.toISOString();
        const orderID = event.id;
        console.log('Old Resource ID:', oldResourceId);
        console.log('New Resource ID:', newResourceId);
        console.log('New Start Time:', newStartTime, event.id);
        newStartTime = moment(newStartTime).utcOffset('+05:30').format();
        if (!oldResourceId) {

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


    function updateOrders(orderID, newResourceId, newStartTime, oldResourceId, eventDropInfo) {

        // const targetMoment = moment(i.endTime);
        // const currentMoment = moment();
        const currentTech = technicians.filter(i => i.id == newResourceId);
        const oldTech = technicians.filter(i => i.id == oldResourceId);
        const currentOrder = oldTech[0].orders.filter((order) => order.order.id == orderID);

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


                    if (orderDataAfter) {
                        var utech = tempTech.filter(i => i.id == tech.id);
                        console.log('=========techhhhhhhhhhhhhhhhhhhhhhhhh===========================');
                        console.log(tech, utech[0]);
                        console.log('====================================');
                        initMap(orderLocation, orderDataAfter.location, orderDataAfter, utech[0]);
                    }

                } else {
                    handleUpdateTechnicianOrders(tech.id, { "distanceDetails": getDistance, "order": orderDetails, eventTime: calculateStartTime(orderDetails, getDistance) });
                }

                setTechnicians(tempTech)
            }
        })

    }


    const handleUpdateTechnicianOrders = (id, newOrder) => {
        //setTechnicians(technicians => {
        var orders = tempTech.map(technician => {
            if (technician.id === id) {
                return { ...technician, orders: [...technician.orders, newOrder] };
            }
            return technician;
        });

        console.log('===================orders=================');
        console.log(orders);
        console.log('====================================');
        tempTech = orders;

        //console.log(orders, tempTechnicians);
        //});
    };


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
