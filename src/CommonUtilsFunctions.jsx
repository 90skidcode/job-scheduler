import moment from 'moment';

export const findClosestTimeIndex = (times, targetTime, type = 'before') => {
    let closestIndex = 0;
    let closestDiff = Math.abs(moment(times[0]).diff(moment(targetTime)));

    for (let i = 1; i < times.length; i++) {
        const diff = Math.abs(moment(times[i]).diff(moment(targetTime)));
        if (type == 'before') {
            if (diff < closestDiff) {
                closestIndex = i;
                closestDiff = diff;
            }
        } else {
            if (diff > closestDiff) {
                closestIndex = i;
                closestDiff = diff;
            }
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