import moment from 'moment';

export const findClosestTimeIndex = (times, targetTime) => {
    let closestIndex = 0;
    let closestDiff = Math.abs(moment(times[0]).diff(moment(targetTime)));

    for (let i = 1; i < times.length; i++) {
        const diff = Math.abs(moment(times[i]).diff(moment(targetTime)));
        if (diff < closestDiff) {
            closestIndex = i;
            closestDiff = diff;
        }
    }

    return closestIndex;

}


export const calculateWorkingHoursBeforeApiCall = (technician, orderDetails) => {
    var time = 0;
    var drivingTime = 0;
    // technician total working time for the day
    var technicianWorkingTime = (parseFloat(technician.workingHours) * 60) * 60;

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


export function calculateStartTime(orderDetails, distanceDetails, newStartTime) {
    var startTime, endTime = '';
    if (newStartTime) {
        startTime = moment(newStartTime).format();
        endTime = moment(newStartTime).add(distanceDetails.duration.value, 'seconds').add(orderDetails.TimeToComplete, 'hours').add((((distanceDetails.duration.value + ((orderDetails.TimeToComplete * 60) * 60)) / 7200) * 900), 'seconds').format();

    } else {
        startTime = moment(orderDetails.startTime).subtract(distanceDetails.duration.value, 'seconds').format();
        endTime = moment(orderDetails.startTime).add(orderDetails.TimeToComplete, 'hours').add((((distanceDetails.duration.value + ((orderDetails.TimeToComplete * 60) * 60)) / 7200) * 900), 'seconds').format();
    }
    return { startTime: startTime, endTime: endTime };
}

export const calculateWorkingHours = (technician, orderDetails) => {
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

export const findIsthatTimeIsFree = (technician, orderDetails, distanceDetails, newStartTime) => {
    var startTime, endTime = '';
    if (newStartTime) {
        startTime = moment(newStartTime).format();
        endTime = moment(newStartTime).add(distanceDetails.duration.value, 'seconds').add(orderDetails.TimeToComplete, 'hours').add((((distanceDetails.duration.value + ((orderDetails.TimeToComplete * 60) * 60)) / 7200) * 900), 'seconds').format();
    } else {
        startTime = moment(orderDetails.startTime).subtract(distanceDetails.duration.value, 'seconds').format();
        endTime = moment(orderDetails.startTime).add(orderDetails.TimeToComplete, 'hours').add((((distanceDetails.duration.value + ((orderDetails.TimeToComplete * 60) * 60)) / 7200) * 900), 'seconds').format();
    }
    console.log(startTime, endTime);
    if (technician.orders.length) {
        console.log('===========dddddddddddddaaaaaa=========================');
        console.log(technician);
        console.log('====================================');
        const flag = technician.orders.map(element => {
            return areTimeRangesOverlapping([startTime, endTime], [element.eventTime.startTime, element.eventTime.endTime]);
        });
        return flag.filter(element => element).length ? false : true;
    } else
        return true

}


export function areTimeRangesOverlapping(time1, time2) {
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

export function beforeAndAfterIndex(dates, givenDate) {
    let beforeIndex = -1;
    let afterIndex = -1;

    for (let i = 0; i < dates.length; i++) {
        if (moment(dates[i]).isBefore(givenDate)) {
            beforeIndex = i;
        } else if (moment(dates[i]).isAfter(givenDate)) {
            afterIndex = i;
            break;
        }
    }

    console.log(`Before index: ${beforeIndex}`);
    console.log(`After index: ${afterIndex}`);

    return { beforeIndex, afterIndex }
}