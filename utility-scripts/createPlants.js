const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json') 

bnUtil.connect(createPlants, vehicle.transportPlan.brand.description+'@outbound-logistics');


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
                        return provideIdentitiesToPlants().then(function () {
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

function provideIdentitiesToPlants() {
    return bnUtil.connection.issueIdentity('outbound.logistics.participant.Plant#' + vehicle.transportPlan.plant.plant,
        vehicle.transportPlan.plant.description + '@outbound-logistics', 'true').then(function (identity) {
            console.log(identity);
            return bnUtil.importCardForIdentity(vehicle.transportPlan.plant.description + '@outbound-logistics', identity);
        }).catch(function (error) {
            console.log(error);
        });
}
