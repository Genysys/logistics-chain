const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json')

bnUtil.connect(createRelevantNissanNodes, vehicle.transportPlan.brand.description + '@outbound-logistics');

function createRelevantNissanNodes() {

    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();


    vehicle.transportPlan.vehicleTransitNode.forEach(node => {
        if (node.transitNode.transitNodeType.transitNodeTypeDesc === "Factory Compound" && node.transitNode.logisticsPartner.logisticsPartnerDesc === "NISSAN") {

            bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Compound")
                .then((compoundRegistry) => {

                    let compound = factory.newResource('outbound.logistics.participant', 'Compound', node.transitNode.transitNode);
                    compound.owner = factory.newRelationship('outbound.logistics.participant', "Manufacturer", vehicle.transportPlan.brand.brand);
                    //compound.description = node.transitNode.transitNodeDesc;

                    compoundRegistry.add(compound).then(function () {
                        console.log('Compound participant added: ' + node.transitNode.transitNode);
                        return provideIdentitiesToCompounds(node.transitNode.transitNode).then(function () {
                            return bnUtil.disconnect();
                        })
                    }).catch((error) => {
                        console.log(error);
                    })
                });
        }
    });
};

function provideIdentitiesToCompounds(transitNode) {
    return bnUtil.connection.issueIdentity('outbound.logistics.participant.Compound#' + transitNode,
        transitNode + '@outbound-logistics', 'true').then(function (identity) {
            console.log(identity);
            return bnUtil.importCardForIdentity(transitNode + '@outbound-logistics', identity);
        }).catch(function (error) {
            console.log(error);
        });
}


// for (let i = 0; i < vehicle.transportPlan.vehicleTransitNode.length; i++) {
//     if (i !== vehicle.transportPlan.vehicleTransitNode.length - 1) {
//         console.log("From: " + vehicle.transportPlan.vehicleTransitNode[i].transitNode.transitNode);
//         console.log("To: " + vehicle.transportPlan.vehicleTransitNode[i + 1].transitNode.transitNode);
//     } else {
//         console.log("Final Destination: " + vehicle.transportPlan.vehicleTransitNode[i].transitNode.transitNode)
//     }
// }

