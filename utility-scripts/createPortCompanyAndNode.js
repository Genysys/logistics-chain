const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json')

bnUtil.connect(createPortCompany, 'admin@outbound-logistics');

function createPortCompany() {

    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();

    vehicle.transportPlan.vehicleTransitNode.forEach(node => {

        if (node.transitNode.transitNodeType.transitNodeTypeDesc === "Port" && node.transitNode.logisticsPartner.logisticsPartnerCode === "KPT") {
            bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.PortCompany")
                .then((portCompanyRegistry) => {

                    let portCompany = factory.newResource('outbound.logistics.participant', 'PortCompany', node.transitNode.logisticsPartner.logisticsPartnerCode);
                    portCompany.companyName = node.transitNode.logisticsPartner.logisticsPartnerDesc;

                    portCompanyRegistry.add(portCompany).then(function () {
                        console.log('Port Company participant added: ' + node.transitNode.logisticsPartner.logisticsPartnerCode);
                        return bnUtil.provideIdentity('outbound.logistics.participant.PortCompany', node.transitNode.logisticsPartner.logisticsPartnerCode, true).then(function () {
                            bnUtil.disconnect().then(() => {
                                bnUtil.connect(() => {createPortNode(node)}, node.transitNode.logisticsPartner.logisticsPartnerCode + '@outbound-logistics');
                            });
                        })
                    }).catch((error) => {
                        console.log(error);
                    })
                });
        }
    });

}

function createPortNode(node) {
    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();
    bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Port")
        .then((portRegistry) => {

            let port = factory.newResource('outbound.logistics.participant', 'Port', node.transitNode.transitNode);
            port.owner = factory.newRelationship('outbound.logistics.participant', "PortCompany", node.transitNode.logisticsPartner.logisticsPartnerCode);
            port.description =  node.transitNode.transitNodeDesc;

            portRegistry.add(port).then(function () {
                console.log('Port participant added: ' + node.transitNode.transitNode);
                return bnUtil.provideIdentity('outbound.logistics.participant.Port', node.transitNode.transitNode).then(function () {
                    bnUtil.disconnect();
                })
            }).catch((error) => {
                console.log(error);
            })
        });
}
