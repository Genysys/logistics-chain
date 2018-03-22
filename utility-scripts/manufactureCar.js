const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json')

bnUtil.connect(manufactureCar, vehicle.transportPlan.plant.plant + '@outbound-logistics');

function manufactureCar() {

    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();

    let options = {
        generate: false,
        includeOptionalFields: false
    }

    let transaction = factory.newTransaction('outbound.logistics.vehicle', 'ManufactureCar')

    manufacturingPlant = factory.newRelationship('outbound.logistics.participant', "Plant", vehicle.transportPlan.plant.plant);

    transaction.setPropertyValue('vin', vehicle.transportPlan.vin);
    transaction.setPropertyValue('brand', vehicle.transportPlan.brand.description);
    transaction.setPropertyValue('model', vehicle.transportPlan.model.description);
    transaction.setPropertyValue('manufacturedDate', new Date())
    transaction.setPropertyValue('manufacturingPlant', manufacturingPlant);

    return bnUtil.connection.submitTransaction(transaction).then(()=> {
        console.log("Car: " + vehicle.transportPlan.vin + " Has Been Manufactured By " + vehicle.transportPlan.plant.description);

        bnUtil.disconnect();
        
    }).catch((error) => {
      console.log(error);
      
      bnUtil.disconnect();
    });
}
