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

    createManufacturers(bnDef).then(function() {
        bnUtil.disconnect();
    });
    
}

function createManufacturers(bnDef) {

    return bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Manufacturer")
        .then(function(participantRegistry) {
            
            let factory = bnDef.getFactory();
            let renaultCall = participantRegistry.exists('RN').then(function(exists) {
                if(!exists) {
                    let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'RN');
                    manufacturer.manufacturerName = 'Renault';
                    return participantRegistry.add(manufacturer);
                    console.log('Manufacturer: Renault added.');
                }
            })
            let nissanCall = participantRegistry.exists('NI').then(function(exists) {
                if(!exists) {
                    let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'NI');
                    manufacturer.manufacturerName = 'Nissan';
                    return participantRegistry.add(manufacturer);
                    console.log('Manufacturer: Nissan added.');
                }
            });
            let mitsubishiCall = participantRegistry.exists('MI').then(function(exists) {
                if(!exists) {
                    let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'MI');
                    manufacturer.manufacturerName = 'Mitsubishi';
                    return participantRegistry.add(manufacturer);
                    console.log('Manufacturer: Mitsubishi added.');
                }
            });

            return Promise.all([renaultCall, nissanCall, mitsubishiCall]);
     }).catch(function(error) {
        console.log('Error has occured when trying to create a manufacturer. Log:');
        console.log(error);
     })
}