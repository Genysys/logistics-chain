const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json')

bnUtil.connect(createDealerCompany, 'EULogisticsNissan@outbound-logistics');

function createDealerCompany() {

    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();

    var transportPlan = factory.newConcept('outbound.logistics.vehicle', 'TransportPlan');
    let transitNodes = vehicle.transportPlan.vehicleTransitNode;

    for(let i = 0; i < transitNodes.length; i++) {

        if(i+1 !== transitNodes.length) {
            var route = factory.newConcept('outbound.logistics.vehicle', 'Route');
            route.from = factory.newRelationship('outbound.logistics.participant', 'Node', transitNodes[i].transitNode.transitNode);
            route.to = factory.newRelationship('outbound.logistics.participant', 'Node', transitNodes[i+1].transitNode.transitNode);
            
            transportPlan.addArrayValue('routes', route);
            console.log("From: " + transitNodes[i].transitNode.transitNode + 
            " To: " + transitNodes[i+1].transitNode.transitNode);
        } else {
            console.log("Final Destination: " + transitNodes[i].transitNode.transitNode);
            transportPlan.finalDestination = factory.newRelationship('outbound.logistics.participant', 'Node', transitNodes[i].transitNode.transitNode);
        }
    }

    transportPlan.setPropertyValue('buyerCode', vehicle.transportPlan.buyerCode);
    transportPlan.setPropertyValue('lastUpdated', new Date());


    let transaction = factory.newTransaction('outbound.logistics.vehicle', 'AssignTransportPlan');
    transaction.setPropertyValue('transportPlan', transportPlan);
    transaction.setPropertyValue('vin', vehicle.transportPlan.vin);

    transportPlanData = {
        vin: vehicle.transportPlan.vin,
        transportPlan: transportPlan
    }
    
    return bnUtil.connection.submitTransaction(transaction).then(()=> {
        console.log("Transport Plan created for: " + vehicle.transportPlan.vin);

        bnUtil.disconnect();
    }).catch((error) => {
      console.log(error);
      
      bnUtil.disconnect();
    });
}

