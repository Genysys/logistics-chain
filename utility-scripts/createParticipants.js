const bnUtil = require('./connection-util');
const AdminConnection = require('composer-admin').AdminConnection;
const IdCard = require('composer-common').IdCard;
bnUtil.connect(main);

let adminConnection; 

function main(error){

    if(error){
        console.log(error);
        process.exit(1);
    }
    
     let bnDef =  bnUtil.connection.getBusinessNetwork();
     console.log("Received Definition from Runtime: ",
                    bnDef.getName(),"  ",bnDef.getVersion());

    adminConnection = new AdminConnection();
    createManufacturers(bnDef).then(function() {
        provideIdentitiesToManufacturers().then(function() {
            bnUtil.disconnect();
        })
        
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
                    console.log('Adding manufacturer... Renault.');
                    return participantRegistry.add(manufacturer);
                }
            })
            let nissanCall = participantRegistry.exists('NI').then(function(exists) {
                if(!exists) {
                    let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'NI');
                    manufacturer.manufacturerName = 'Nissan';
                    console.log('Adding manufacturer... Nissan.');
                    return participantRegistry.add(manufacturer);
                }
            });
            let mitsubishiCall = participantRegistry.exists('MI').then(function(exists) {
                if(!exists) {
                    let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'MI');
                    manufacturer.manufacturerName = 'Mitsubishi';
                    console.log('Adding manufacturer... Mitsubishi.');
                    return participantRegistry.add(manufacturer);
                }
            });

            return Promise.all([renaultCall, nissanCall, mitsubishiCall]);
     }).catch(function(error) {
        console.log('Error has occured when trying to create a manufacturer. Log:');
        console.log(error);
     })
}

function provideIdentitiesToManufacturers() {
    
    let renaultIdentity = bnUtil.connection.issueIdentity('outbound.logistics.participant.Manufacturer#RN', 
        'Renault@outbound-logistics', 'true').then((identity) => {
            return importCardForIdentity('Renault@outbound-logistics', identity);
        }).catch(function(error) {
            console.log(error);
        });

    let nissanIdentity = bnUtil.connection.issueIdentity('outbound.logistics.participant.Manufacturer#NI', 
        'Nissan@outbound-logistics', 'true').then((result) => {
            return importCardForIdentity('Renault@outbound-logistics', identity);
        }).catch(function(error) {
            
        });

    
    let mitsubishiIdentity = bnUtil.connection.issueIdentity('outbound.logistics.participant.Manufacturer#MI', 
        'Mitsubishi@outbound-logistics', 'true').then((result) => {
            return importCardForIdentity('Renault@outbound-logistics', identity);
        }).catch(function(error) {
            
        });

    return Promise.all([nissanIdentity, renaultIdentity, mitsubishiIdentity]);

}

function importCardForIdentity(cardName, identity) {
    const connectionProfile = {
        "name":cardName,
        "type":"hlfv1",
        "orderers":[{"url":"grpc://localhost:7050"}],
        "ca":{"url":"http://localhost:7054",
        "name":"ca.org1.example.com"},
        "peers":[{"requestURL":"grpc://localhost:7051","eventURL":"grpc://localhost:7053"}],
        "channel":"composerchannel",
        "mspID":"Org1MSP",
        "timeout":300
    };
    const metadata = {
        userName: identity.userID,
        version: 1,
        enrollmentSecret: identity.userSecret,
        businessNetwork: 'outbound-logistics'
    };
    const card = new IdCard(metadata, connectionProfile);
    console.log("Issuing card for " + identity.userId + "...");
    return adminConnection.importCard(cardName, card);
}
