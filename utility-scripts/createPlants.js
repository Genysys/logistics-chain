const bnUtil = require('./connection-util');

bnUtil.connect(createPlants, 'Nissan@outbound-logistics');

function createPlants() {

    let bnDef = bnUtil.connection.getBusinessNetwork();

    bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Plant")
        .then(function (plantRegistry) {
            let factory = bnDef.getFactory();

            plantRegistry.exists('NMUK').then(function (exists) {
                if (!exists) {
                    let plant = factory.newResource('outbound.logistics.participant', 'Participant', 'NMUK');
                    plant.plantOwner = '';
                    console.log('Adding manufacturer...' + manufacturerData.manufactureName);
                    plantRegistry.add(manufacturer).then(function () {
                        return provideIdentitiesToManufacturers(manufacturerData).then(function () {
                        }).then(function() {
                            if (idx === list.length - 1) {
                                return bnUtil.disconnect();
                            }
                        });
                    });
                } else {
                    console.log("Manufacturers are already in the network.");
                    return bnUtil.disconnect();
                }
            })
    });
}
