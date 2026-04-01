# Courier Delivery Service CLI Application

A Node.js command line interface application to calculate:
- Applied discounts on total delivery cost
- Delivery cost per package
- Estimated delivery time with optimized shipment and assigned vehicles
- Input validation (duplicates, missing values, invalid data)

## Features
### Total Delivery Cost Calculation
Delivery Cost = Base Delivery Cost + (Package Total Weight * 10) + (Distance to Destination * 5)

### Applicable Discounts 
Supports multiple offer codes with conditions:
|  Code  | Discount | Distance (km) |  Weight (kg) |
| OFR001 |    10%   |    < 200      |   70 - 200   |
| OFR002 |    7%    |    50 - 150   |   100 - 250  |
| OFR003 |    5%    |    50 - 250   |   10 - 150   |

Criterias:
- Only **one offer per package**
- If **offer criterias** are not met or **not valid/found**, discount = `0`

### Delivery Time Estimation
The application optimizes deliveries by:
- Maximum carriable weight per trip
- Same speed and route
- Multiple vehicles 
- Round trip vehicle scheduling

Criterias:
- Maximize **number of packages** per trip
- If same, choose **higher total weight**
- If same, choose delivery with **shorter delivery time**

## Overview
Input -> Validate -> Calculate cost -> Apply discount
-> Generate deliveries -> Assign to earliest avaiable vehicle -> Calculate delivery time
-> Output

## Project Structure
├── app.js # CLI handling in terminal \
├── calculator.js # Cost + discount logic \
├── delivery.js # Delivery optimization logic \
├── offers.js # Store applicable offers \
├── README.md

## How to Run Application
### 1. Install Node.js
- node -v

### 2. Run the App
- node app

### 3. Input Format
#### STEP 1: Delivery Information
{base_delivery_cost} {no_of_packages}

#### STEP 2: Package(s) Information
{pkg_id} {pkg_weight_in_kg} {distance_in_km} {offer_code}

#### STEP 3: Vehicle Information
{no_of_vehicles} {max_speed} {max_carriable_weight}

### Sample Input
100 5 \
PKG1 50 30 OFR001 \
PKG2 75 125 OFR008 \
PKG3 175 100 OFR003 \
PKG4 110 60 OFR002 \
PKG5 155 95 NA \
2 70 200

### 4. Output Format
{pkg_id} {discount} {total_cost} {estimated_delivery_time_in_hours}

### Sample Output
PKG1 0 750 3.98 \
PKG2 0 1475 1.78 \
PKG3 0 2350 1.42 \
PKG4 105 1395 0.85 \
PKG5 0 2125 4.19

## Implementation
### Discount Handling
- Case-sensitive offer codes
- Not valid/found conditions returns 0

### Delivery Optimization
- Generate all possible and valid combinations:
- Filters combinations exceeding max weeight
- Sort based on: 
    - Number of packages (desc) <-- maximizing number of packages
    - Total weight (desc) <-- heavier weight
    - Max distance (asc) <-- shortest distance

### Vehicle Scheduling
- Tracks vehicle availability time
- Assigns deliveries to earliest available vehicle
- Includes round-trip time (* 2)
    - vehicle_available_time += (max_distance / speed) * 2

### Time Formatting
- Truncate time with 2 decimal spaces, did not round up
    - Math.floor(value * 100) / 100

### Validation
- Each package is validated during parsing
- Invalid packages are flagged with 'isInvalid'
    - Missing fields -> isInvalid: true
    - Invalid numbers -> isInvalid: true
    - Duplicate package IDs -> isInvalid: true
    - Invalid offer codes -> Invalid offer codes
- Invalid packages are still displayed with defaults
    - discount = 0
    - total_cost = 0
    - estimated_delivery_time = 0.00

### Edge Cases
- Weight/distance outside discount range
- Multiple shipments with same conditions
- Floating point precision handling

## Future Improvements
- Unit Testing (Jest)
- Convert CLI to REST API (Express)
- Build interface (React)
- Store in database (MongoDB)
- Add real-time tracking (GPS, delivery time remaining)

## Challenges
- Node.js CLI implementation
- Algorithmic Optimization (Backtracking and Scheduling)
