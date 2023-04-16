import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';


function TechnicianSchedule({ technicians }) {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        var eventsList = events;
        technicians.forEach(technician => {

            technician.orders.forEach(order => {
               
                const exists = eventsList.some((e) => {
                    return 
                        e.id == order.order.id
                });

                if (!exists)
                    eventsList.push({
                        title: order.order.name,
                        id:order.order.id,
                        start: order.eventTime.startTime,
                        end: order.eventTime.endTime,
                        resourceId: technician.id,
                        extendedProps: {   
                            description: order.order.name+ ">>",
                          }
                    })
            });
        });
        setEvents(eventsList);

    }, [technicians])

    console.log('====================================');
    console.log(events);
    console.log('====================================');

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
    
        console.log('Old Resource ID:', oldResourceId);
        console.log('New Resource ID:', newResourceId);
        console.log('New Start Time:', newStartTime,event.id);
    
        if(!oldResourceId){

        }else{
            
        }
        
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
