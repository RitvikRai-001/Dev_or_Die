export function generateDosesFromCapsule(capsule) {
  const doses = [];
  let current = new Date(capsule.startDate);
  const end = new Date(capsule.endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];

    capsule.timesOfDay.forEach((time) => {
      doses.push({
        id: `${capsule._id}-${dateStr}-${time}`, // unique
        name: capsule.name,
        date: dateStr,
        time: time,
        status: "pending",
      });
    });

    current.setDate(current.getDate() + 1);
  }

  return doses;
}
