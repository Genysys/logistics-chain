const namespace = "outbound.logistics.participant.Manufacturer";
const transactionType = "CreateFlight";

const bnUtil = require('./connection-util');
bnUtil.connect(main);

function main(error){

    if(error){
        console.log(error);
        process.exit(1);
    }
    
     let bnDef =  bnUtil.connection.getBusinessNetwork();
     console.log("Received Definition from Runtime: ",
                    bnDef.getName(),"  ",bnDef.getVersion());

    createManufacturers(bnDef);
}

function createManufacturers(bnDef) {
    bnUtil.connection.getParticipantRegistry(namespace)
        .then(function(participantRegistry) {
            let factory = bnDef.getFactory();

            participantRegistry.exists('RN').then(function(exists) {
                if(!exists) {
                    let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'RN');
                    manufacturer.manufacturerName = 'Renault';
                    participantRegistry.add(manufacturer);
                    console.log('Manufacturer: Renault added.');
                }
            });
            participantRegistry.exists('NI').then(function(exists) {
                if(!exists) {
                    let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'NI');
                    manufacturer.manufacturerName = 'Nissan';
                    participantRegistry.add(manufacturer);
                    console.log('Manufacturer: Nissan added.');
                }
            });
            participantRegistry.exists('MI').then(function(exists) {
                if(!exists) {
                    let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'MI');
                    manufacturer.manufacturerName = 'Mitsubishi';
                    participantRegistry.add(manufacturer);
                    console.log('Manufacturer: Mitsubishi added.');
                }
            });

            console.log('Manufacturers are now ready.')
            
            console.log('All participants have been created. Exiting.')
            bnUtil.disconnect();
     }).catch(function(error) {
        console.log('Error has occured when trying to create a manufacturer. Log:');
        console.log(error);
     })
}