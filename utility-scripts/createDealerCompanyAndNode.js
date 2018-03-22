const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json')

bnUtil.connect(createDealerCompany, 'admin@outbound-logistics');

function createDealerCompany() {

    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();

    vehicle.transportPlan.vehicleTransitNode.forEach(node => {

        if (node.transitNode.transitNodeType.transitNodeTypeDesc === "Dealer") {
            bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Dealer")
                .then((dealerRegistry) => {

                    let dealer = factory.newResource('outbound.logistics.participant', 'Dealer', 'Leendert van den Born');

                    dealerRegistry.add(dealer).then(function () {
                        console.log('Dealer participant added: ' + 'Leendert van den Born');
                        return bnUtil.provideIdentity('outbound.logistics.participant.Dealer', 'Leendert van den Born', true).then(function () {
                            bnUtil.disconnect().then(() => {
                                bnUtil.connect(() => {createDealership(node)}, 'Leendert van den Born' + '@outbound-logistics');
                            });
                        })
                    }).catch((error) => {
                        console.log(error);
                    })
                });
        }
    });

}

function createDealership(node) {
    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();
    bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Dealership")
        .then((dealershipRegistry) => {

            let dealership = factory.newResource('outbound.logistics.participant', 'Dealership', node.transitNode.transitNode);
            dealership.owner = factory.newRelationship('outbound.logistics.participant', "Dealer", 'Leendert van den Born');
            dealership.description =  node.transitNode.transitNodeDesc;

            dealershipRegistry.add(dealership).then(function () {
                console.log('Dealership participant added: ' + node.transitNode.transitNode);
                return bnUtil.provideIdentity('outbound.logistics.participant.Dealership', node.transitNode.transitNode).then(function () {
                    bnUtil.disconnect();
                })
            }).catch((error) => {
                console.log(error);
            })
        });
}
