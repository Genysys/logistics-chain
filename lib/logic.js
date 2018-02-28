'use strict';

/**
 * Manufacture a car
 * @param {outbound.logistics.vehicle.ManufactureCar} car
 * @transaction
 */
function onCarManufactured(carData) {

    var getCurrentTime = new Date();

    console.log(carData);

    return getAssetRegistry('outbound.logistics.vehicle.Car').then(function(carRegistry) {
        var factory = getFactory();

        var car = factory.newResource('outbound.logistics.vehicle', 'Car', carData.vin);
        car.brand = carData.brand;
        car.model = carData.model;
        car.manufacturedDate = getCurrentTime;
        
        if(carData.doors) {
            car.doors = carData.doors;
        }
        if(carData.boot) {
            car.boot = carData.boot;
        }

       return carRegistry.add(car);
    });
    // CREATE NEW EVENT: CarCreated
}
