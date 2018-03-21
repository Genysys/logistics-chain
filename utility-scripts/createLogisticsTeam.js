const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json') 

bnUtil.connect(createLogisticsTeam, 'Nissan@outbound-logistics');


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
                        return provideIdentityLogisticsTeam().then(function () {
                            return bnUtil.disconnect();
                        })
                    })
                } else {
                    console.log('Logistics Team have already been added.');
                    bnUtil.disconnect();
                }
            })
    });
}

function provideIdentityLogisticsTeam() {
    return bnUtil.connection.issueIdentity('outbound.logistics.participant.LogisticsTeam#EULogisticsNissan',
        'EULogisticsNissan@outbound-logistics', 'true').then(function (identity) {
            console.log(identity);
            return bnUtil.importCardForIdentity('EULogisticsNissan@outbound-logistics', identity);
        }).catch(function (error) {
            console.log(error);
        });
}
