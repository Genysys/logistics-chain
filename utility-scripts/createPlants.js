const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json') 

bnUtil.connect(createPlants, vehicle.transportPlan.brand.brand+'@outbound-logistics');


function createPlants() {

    let bnDef = bnUtil.connection.getBusinessNetwork();

    bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Plant")
        .then(function (plantRegistry) {
            let factory = bnDef.getFactory();

            plantRegistry.exists(vehicle.transportPlan.plant.plant).then(function (exists) {
                if (!exists) {
                    let plant = factory.newResource('outbound.logistics.participant', 'Plant', vehicle.transportPlan.plant.plant);
                    plant.owner = factory.newRelationship('outbound.logistics.participant', "Manufacturer", vehicle.transportPlan.brand.brand);
                    plant.description = vehicle.transportPlan.plant.description; 
                    
                    plantRegistry.add(plant).then(function () {
                        console.log('Plant participant added: ' + vehicle.transportPlan.plant.plant);
                        return bnUtil.provideIdentity('outbound.logistics.participant.Plant', vehicle.transportPlan.plant.plant, false).then(function () {
                            return bnUtil.disconnect();
                        })
                    })
                } else {
                    console.log('Plants have already been added.');
                    bnUtil.disconnect();
                }
            })
    });
}
