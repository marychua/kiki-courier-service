// Problem 2 - estimate delivery time per package
function calculateDelivery(packages, max_carriable_weight) {
  const results = [];

  function backtrack(start, current, totalWeight) {
    if (totalWeight > max_carriable_weight) return;

    if (current.length > 0) {
      results.push([...current]);
    }

    for (let i = start; i < packages.length; i++) {
      current.push(packages[i]);
      backtrack(i + 1, current, totalWeight + packages[i].weight);
      current.pop();
    }
  }

  backtrack(0, [], 0);

  results.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;

    const weightA = a.reduce((sum, p) => sum + p.weight, 0);
    const weightB = b.reduce((sum, p) => sum + p.weight, 0);
    if (weightB !== weightA) return weightB - weightA;

    const distanceA = Math.max(...a.map((p) => p.distance));
    const distanceB = Math.max(...b.map((p) => p.distance));
    return distanceA - distanceB;
  });

  return results.length > 0 ? results[0] : [];
}

function assignDeliveries(
  packages,
  no_of_vehicles,
  max_speed,
  max_carriable_weight,
) {
  const vehicles = new Array(no_of_vehicles).fill(0);
  const remainingPackages = [...packages];

  while (remainingPackages.length > 0) {
    const delivery = calculateDelivery(remainingPackages, max_carriable_weight);

    if (!delivery || delivery.length === 0) {
      break; // nothing more can be processed
    }

    delivery.forEach((pkg) => {
      const index = remainingPackages.findIndex((p) => p.id === pkg.id);
      remainingPackages.splice(index, 1);
    });

    const vehicleIndex = vehicles.indexOf(Math.min(...vehicles));
    const startTime = vehicles[vehicleIndex];

    const maxDistance = Math.max(...delivery.map((p) => p.distance));
    const tripTime = maxDistance / max_speed;

    delivery.forEach((pkg) => {
      pkg.estimated_delivery_time_in_hours = formatTime(
        startTime + pkg.distance / max_speed,
      );
    });

    vehicles[vehicleIndex] += tripTime * 2;
  }

  return packages;
}

function formatTime(value) {
  // do not just round up, truncate it
  return (Math.floor(value * 100) / 100).toFixed(2);
  //   return Math.floor(value);
}

module.exports = { assignDeliveries };
