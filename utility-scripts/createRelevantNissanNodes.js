const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json')

bnUtil.connect(createRelevantNissanNodes, vehicle.transportPlan.brand.brand + '@outbound-logistics');

function createRelevantNissanNodes() {

    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();


    vehicle.transportPlan.vehicleTransitNode.forEach(node => {
        if (node.transitNode.transitNodeType.transitNodeTypeDesc === "Factory Compound" && node.transitNode.logisticsPartner.logisticsPartnerDesc === "NISSAN") {

            bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Compound")
                .then((compoundRegistry) => {

                    let compound = factory.newResource('outbound.logistics.participant', 'Compound', node.transitNode.transitNode);
                    compound.owner = factory.newRelationship('outbound.logistics.participant', "Manufacturer", vehicle.transportPlan.brand.brand);
                    compound.description = node.transitNode.transitNodeDesc;

                    compoundRegistry.add(compound).then(function () {
                        console.log('Compound participant added: ' + node.transitNode.transitNode);
                        return bnUtil.provideIdentity('outbound.logistics.participant.Compound', node.transitNode.transitNode).then(function () {
                            return bnUtil.disconnect();
                        })
                    }).catch((error) => {
                        console.log(error);
                    })
                });
        }
    });
};
