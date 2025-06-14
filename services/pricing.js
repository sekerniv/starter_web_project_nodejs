function nextOccurrence(day, hour, reference) {
  const date = new Date(reference);
  date.setHours(hour, 0, 0, 0);
  const currentDay = date.getDay(); // 0 (Sun) to 6 (Sat)
  const dayDiff = (day - currentDay + 7) % 7;
  date.setDate(date.getDate() + dayDiff);
  return date;
}

function calculateParkingFee(parkingLot, entryTime, exitTime, isResident = false) {
  const hourlyRate = parkingLot.hourly?.hourPrice || 0;
  const flatRate = parkingLot.flatRate;
  const residentDiscount = isResident ? (parkingLot.residentDiscount ?? 1) : 1;

  const flatSegment = flatRate?.times?.find(segment => {
    const from = nextOccurrence(segment.fromDay, segment.fromHour, entryTime);
    const to = nextOccurrence(segment.toDay, segment.toHour, from);
    return entryTime >= from && entryTime < to;
  });

  let total = 0;

  if (flatSegment) {
    const from = nextOccurrence(flatSegment.fromDay, flatSegment.fromHour, entryTime);
    const to = nextOccurrence(flatSegment.toDay, flatSegment.toHour, from);

    if (exitTime <= to) {
      total = flatRate.price;
    } else {
      const msAfterFlatRate = exitTime - to;
      const hours = Math.ceil(msAfterFlatRate / (60 * 60 * 1000));
      total = flatRate.price + hourlyRate * hours;
    }
  } else {
    const ms = exitTime - entryTime;
    const hours = Math.ceil(ms / (60 * 60 * 1000));
    total = hourlyRate * hours;
  }

  return total * residentDiscount;
}



module.exports = { calculateParkingFee };