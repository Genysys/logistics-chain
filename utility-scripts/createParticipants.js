const bnUtil = require('./connection-util');
const AdminConnection = require('composer-admin').AdminConnection;
const IdCard = require('composer-common').IdCard;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection
const cardStore = require('composer-common').FileSystemCardStore

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

    participantList = {
        "manufacturers": [
            {
                "manufactureId": "RN",
                "manufactureName": "Renault"
            },
            {
                "manufactureId": "NI",
                "manufactureName": "Nissan",
                "plants": [
                    {
                        
                    }
                ]
            },
            {
                "manufactureId": "MI",
                "manufactureName": "Mitsubishi"
            }
        ]
    }                


    adminConnection = new AdminConnection();
    createManufacturers(bnDef, participantList.manufacturers).then(() => {
        //bnUtil.disconnect();
    });
    
}


function createManufacturers(bnDef, manufacturerList) {

    return bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Manufacturer")
        .then((manufacturerRegistry) => {
            
            let factory = bnDef.getFactory();
            manufacturerList.forEach((manufacturerData) => {
                manufacturerRegistry.exists(manufacturerData.manufactureId).then((exists) => {
                    if(!exists) {
                        let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', manufacturerData.manufactureId);
                        manufacturer.manufacturerName = manufacturerData.manufactureName;
                        console.log('Adding manufacturer...' + manufacturerData.manufactureName);
                        manufacturerRegistry.add(manufacturer).then(() => {
                            provideIdentitiesToManufacturers(manufacturerData).then(() => {
                                //createPlant(manufacturerData);
                            });
                        });
                    }
                })
            })
     }).catch((error) => {
        console.log('Error has occured when trying to create a manufacturer. Log:');
        console.log(error);
     })
}

function provideIdentitiesToManufacturers(manufacturerData) {

    return bnUtil.connection.issueIdentity('outbound.logistics.participant.Manufacturer#' + manufacturerData.manufactureId, 
         manufacturerData.manufactureName + '@outbound-logistics', 'true').then((identity) => {
             return importCardForIdentity(manufacturerData.manufactureName + '@outbound-logistics', identity);
         }).catch((error) => {
             console.log(error);
    });
}

function createPlant(manufacturerData) {
               
         businessNetworkConnection = new BusinessNetworkConnection({ cardStore: bnUtil.cardStore });                                
         return businessNetworkConnection.connect(manufacturerData.manufactureName + '@outbound-logistics').then(() => {
            return businessNetworkConnection.getParticipantRegistry('outbound.logistics.participant.Plant').then((plantRegistry) => {
                let factory = businessNetworkConnection.getFactory();
                
                console.log(manufacturerData);
            })
         }).catch((error) => {
             console.log(error);
         });
}

function importCardForIdentity(cardName, identity) {
    const connectionProfile = {
        "name":cardName,
        "type":"hlfv1",
        "orderers":[{"url":"grpc://localhost:7050"}],
        "ca":{
            "url":"http://localhost:7054",
            "name":"ca.org1.example.com"
        },
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
    console.log("Issuing card for " + identity.userID + "...");
    return adminConnection.importCard(cardName, card);
}
