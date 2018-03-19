const bnUtil = require('./connection-util');
bnUtil.connect(viewAllCars);

function viewAllCars() {
    let bnDef = bnUtil.connection.getBusinessNetwork();
    bnUtil.connection.getAssetRegistry('outbound.logistics.vehicle.Car')
        .then((carRegistry) => {
            return carRegistry.exists('VEHICLE1').then((exists) => {
                console.log(exists);
            });
        })
}