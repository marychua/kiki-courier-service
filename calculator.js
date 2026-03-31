const offers = require("./offers");

// Problem 1 - estimate total delivery cost per package (calculates cost and discount)
function calculateCost(baseCost, weight, distance) {
  return baseCost + weight * 10 + distance * 5;
}

function getDiscount(totalCost, weight, distance, code) {
  if (!code) return 0;

  // convert it to lowercase to ensure offer code is readable
  const disCode = code.toString().toLowerCase();
  const offer = offers[disCode];

  // if no offers then no discounts
  if (!offer) return 0;

  // check validity of weight and distance based on offer, else return no discounts
  const validWeight = weight >= offer.minWeight && weight <= offer.maxWeight;
  const validDistance =
    distance >= offer.minDistance && distance <= offer.maxDistance;

  if (!validWeight || !validDistance) return 0;

  //   const finalDiscount = (totalCost * offer.discount).toFixed(2); // --> 110.00 (with decimal + round up)
  const finalDiscount = Math.floor(totalCost * offer.discount); // --> 110 (whole number)

  return finalDiscount;
}

module.exports = { calculateCost, getDiscount };
