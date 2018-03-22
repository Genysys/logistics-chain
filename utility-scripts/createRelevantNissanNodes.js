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
                            bnUtil.disconnect();
                        })
                    }).catch((error) => {
                        console.log(error);
                    })
                });
        }
         if (node.transitNode.transitNodeType.transitNodeTypeDesc === "Port" && node.transitNode.logisticsPartner.logisticsPartnerCode === "NSA") {
            bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Port")
                .then((portRegistry) => {
                    
                    let port = factory.newResource('outbound.logistics.participant', 'Port', node.transitNode.logisticsPartner.logisticsPartnerCode);
                    port.owner = factory.newRelationship('outbound.logistics.participant', "Manufacturer", vehicle.transportPlan.brand.brand);
                    port.description = node.transitNode.logisticsPartner.logisticsPartnerDesc;

                    portRegistry.add(port).then(function () {
                        console.log('Port participant added: ' + node.transitNode.logisticsPartner.logisticsPartnerCode);
                        return bnUtil.provideIdentity('outbound.logistics.participant.Port', node.transitNode.logisticsPartner.logisticsPartnerCode).then(function () {
                            
                        })
                    }).catch((error) => {
                        console.log(error);
                    })
                });
        }
    });
};
