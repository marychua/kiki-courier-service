const readline = require("readline");
const { calculateCost, getDiscount } = require("./calculator");
const { assignDeliveries } = require("./delivery");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let lines = [];

console.log(
  `Please enter delivery information: (base_delivery_cost) (no_of_packages)`,
);

rl.on("line", (input) => {
  lines.push(input.trim());

  // STEP 1: delivery info
  const headerLine = lines[0].split(/\s+/);
  const base_delivery_cost = Number(headerLine[0]);
  const no_of_packages = Number(headerLine[1]);

  // STEP 2: packages info
  if (lines.length === 1) {
    console.log(
      `Please enter ${no_of_packages} package(s) information: (id) (weight) (distance) (offer_code):`,
    );
    return;
  }

  // STEP 3: vehicle info
  if (lines.length === no_of_packages + 1) {
    console.log(
      `Please enter vehicle information: (no_of_vehicles) (max_speed max_weight)`,
    );
    return;
  }

  if (lines.length === no_of_packages + 2) {
    const packageLines = lines.slice(1, 1 + no_of_packages);
    const vehicleLine = lines[lines.length - 1];

    processInput(base_delivery_cost, packageLines, vehicleLine);
    rl.close(); // stop reading
  }
});

function processInput(baseCost, packageLines, vehicleLine) {
  // vehicle info
  const vehicleInfo = vehicleLine.split(/\s+/);
  const no_of_vehicles = Number(vehicleInfo[0]);
  const max_speed = Number(vehicleInfo[1]);
  const max_carriable_weight = Number(vehicleInfo[2]);
  const seenIds = {};

  // packages list
  const packages = packageLines.map((line) => {
    const parts = line.split(/\s+/);
    const pkg_id = parts[0];
    const pkg_weight_in_kg = Number(parts[1]);
    const distance_in_km = Number(parts[2]);
    const offer_code = parts[3];
    let isValid = true;

    // check if 4 values are provided in each packagesline
    if (parts.length < 4) {
      isValid = false;
    }

    // check invalid numbers
    if (isNaN(pkg_weight_in_kg) || isNaN(distance_in_km)) {
      isValid = false;
    }

    // check duplicate IDs
    if (seenIds[pkg_id]) {
      isValid = false; // duplication detected
    } else {
      seenIds[pkg_id] = true;
    }

    // if is not valid - returns default object
    if (!isValid) {
      return {
        id: pkg_id || "INVALID_ID",
        weight: 0,
        distance: 0,
        discount: 0,
        total_cost: 0,
        estimated_delivery_time_in_hours: "0.00",
        isInvalid: true,
      };
    }

    // if valid - returns data
    const cost = calculateCost(baseCost, pkg_weight_in_kg, distance_in_km);
    const discount = getDiscount(
      cost,
      pkg_weight_in_kg,
      distance_in_km,
      offer_code,
    );
    const total_cost = cost - discount;

    return {
      id: pkg_id,
      weight: pkg_weight_in_kg,
      distance: distance_in_km,
      discount,
      total_cost,
    };
  });

  const validPackages = packages.filter(pkg => !pkg.isInvalid);

  // assign delivery times
  const assignedPackages = assignDeliveries(
    validPackages,
    no_of_vehicles,
    max_speed,
    max_carriable_weight,
  );

  assignedPackages.forEach((pkg) => {
    console.log(
      `${pkg.id} ${pkg.discount} ${pkg.total_cost} ${pkg.estimated_delivery_time_in_hours}`,
    );
  });
}
