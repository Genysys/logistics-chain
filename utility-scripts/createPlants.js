const bnUtil = require('./connection-util');

bnUtil.connect(createPlants, 'Nissan@outbound-logistics');

function createPlants() {

    let bnDef = bnUtil.connection.getBusinessNetwork();

    bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Plant")
        .then(function (plantRegistry) {
            let factory = bnDef.getFactory();

            plantRegistry.exists('NMUK').then(function (exists) {
                if (!exists) {
                    let plant = factory.newResource('outbound.logistics.participant', 'Plant', 'NMUK');
                    plant.owner = factory.newRelationship('outbound.logistics.participant', "Manufacturer", 'NI'); 
                    
                    plantRegistry.add(plant).then(function () {
                        console.log('Plant participant added: ' + 'NMUK');
                        bnUtil.disconnect();
                    })
                } else {
                    console.log('Plants have already been added.');
                    bnUtil.disconnect();
                }
            })
    });
}
