const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json') 

bnUtil.connect(createLogisticsTeam, vehicle.transportPlan.brand.brand + '@outbound-logistics');


function createLogisticsTeam() {

    let bnDef = bnUtil.connection.getBusinessNetwork();

    bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.LogisticsTeam")
        .then(function (logisticsTeamRegistry) {
            let factory = bnDef.getFactory();

            logisticsTeamRegistry.exists('EULogisticsNissan').then(function (exists) {
                if (!exists) {
                    let logisticsTeam = factory.newResource('outbound.logistics.participant', 'LogisticsTeam', 'EULogisticsNissan');
                    logisticsTeam.company = factory.newRelationship('outbound.logistics.participant', "Manufacturer", vehicle.transportPlan.brand.brand);
                    
                    logisticsTeamRegistry.add(logisticsTeam).then(function () {
                        console.log('Logistics participant added: ' + 'EULogisticsNissan');
                        return bnUtil.provideIdentity('outbound.logistics.participant.LogisticsTeam', 'EULogisticsNissan', false).then(function () {
                            return bnUtil.disconnect();
                        })
                    }).catch((erorr) => {
                        console.log(error);
                    })
                } else {
                    console.log('Logistics Team has already been added.');
                    bnUtil.disconnect();
                }
            })
    }).catch((error) => {
        console.log(erorr);
    });
}
