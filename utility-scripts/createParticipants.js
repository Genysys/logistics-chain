 // Constant values - change as per your needs
 const namespace = "outbound.logistics.participant.Manufacturer";
 const transactionType = "CreateFlight";

// 1. Connect to airlinev7
const bnUtil = require('./connection-util');
bnUtil.connect(main);

function main(error){
    
    // Check for error
    if(error){
        console.log(error);
        process.exit(1);
    }

     // 2. Get the Business Network Definition
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


// return createParticipants('outbound.logistics.participant.Manufacturer')
//     .then(function (participantRegistry) {
//         let factory = getFactory();

//         let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'RN');
//         manufacturer.companyName = 'Renault';

//         return participantRegistry.add(manufacturer);
//     }).catch(function (erorr) {
//         console.log('Error has occured when trying to create a manufacturer. Log:');
//         console.log(error);
//     });


// return BusinessNetwork.connect('admin@outbound-logistics')
//     .then(function(businessNetworkDefinition) {
//         return businessNetworkDefinition,.addParticipantRegistry('')
// }) 

// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// let businessNetworkConnection = new BusinessNetworkConnection();
// return businessNetworkConnection.connect('admin@outbound-logistics')
//     .then(() => {
//         return businessNetworkConnection.getParticipantRegistry('outbound.logistics.participant.Manufacturer');
//     })
//     .then((participantRegistry) => {
//         let factory = businessNetworkConnection.getFactory();
//         let manufacturer = factory.newResource('outbound.logistics.participant.Manufacturer', 'Renault', 'RN@outbound-logistics');
//         manufacturer.companyName = 'Renault';
//         return participantRegistry.add(manufacturer);
//     })
//     .then(() => {
//         return businessNetworkConnection.disconnect();
//     })
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });

// function createManufacturer() {
    
//     return manufacturer;
// }