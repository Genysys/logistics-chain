'use strict';

/**
 * Manufacture a car
 * @param {outbound.logistics.vehicle.ManufactureCar} carData
 * @transaction
 */
function onCarManufactured(carData) {
    
    var factory = getFactory();

    var car = factory.newResource('outbound.logistics.vehicle', 'Car', carData.vin);
    car.brand = carData.brand;
    car.model = carData.model;
    car.manufacturedDate = carData.manufacturedDate;
    car.manufacturingPlant = carData.manufacturingPlant;

    if (carData.doors) {
        car.doors = carData.doors;
    }
    if (carData.boot) {
        car.boot = carData.boot;
    }

    return getAssetRegistry('outbound.logistics.vehicle.Car').then(function (carRegistry) {
        console.log("Car to be added: " + car);
        return carRegistry.add(car);
    });
    // CREATE NEW EVENT: CarCreated
}

/**
 * Assign a Transport Plan to a vehicle.
 * Transaction is only available to 
 * @param {outbound.logistics.vehicle.AssignTransportPlan} transportPlanData
 * @transaction
 */
function onTransportPlanAssignment(transportPlanData) {

}

/**
 * Manufacturer creates a plant
 * @param {outbound.logistics.participant.CreatePlant} plantData
 * @transaction
 */
function createPlant(plantData) {

    return getParticipantRegistry('outbound.logistics.participant.Plant').then(function (plantRegistry) {
        var factory = getFactory();

        var plant = factory.newResource('outbound.logistics.participant', 'Plant', plantData.plantId);
        plant.owner = plantData.owner;

        return plantRegistry.add(plant);
    });
    // CREATE NEW EVENT: PlantCreated
}

