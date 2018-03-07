const bnUtil = require('./connection-util');
const AdminConnection = require('composer-admin').AdminConnection;
const IdCard = require('composer-common').IdCard;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection
const cardStore = require('composer-common').FileSystemCardStore

let participantList = require('./participants.json') 
bnUtil.connect(setUp);
let adminConnection;

function setUp(error) {

    if (error) {
        console.log(error);
        process.exit(1);
    }

    let bnDef = bnUtil.connection.getBusinessNetwork();
    console.log("Received Definition from Runtime: ",
        bnDef.getName(), "  ", bnDef.getVersion());


    adminConnection = new AdminConnection();
    createManufacturers(bnDef, participantList.manufacturers);
}


function createManufacturers(bnDef, manufacturerList) {

    bnUtil.connection.getParticipantRegistry("outbound.logistics.participant.Manufacturer")
        .then(function (manufacturerRegistry) {

            let factory = bnDef.getFactory();
            manufacturerList.forEach(function (manufacturerData, idx, list) {
                manufacturerRegistry.exists(manufacturerData.manufactureId).then(function (exists) {
                    if (!exists) {
                        let manufacturer = factory.newResource('outbound.logistics.participant', 'Manufacturer', manufacturerData.manufactureId);
                        manufacturer.manufacturerName = manufacturerData.manufactureName;
                        manufacturerRegistry.add(manufacturer).then(function () {
                            console.log('Manufacturer particpant added: ' + manufacturerData.manufactureName);
                            return provideIdentitiesToManufacturers(manufacturerData).then(function () {
                            }).then(function() {
                                if (idx === list.length - 1) {
                                    return bnUtil.disconnect();
                                }
                            });
                        });
                    } else {
                        console.log("Manufacturers are already in the network.");
                        return bnUtil.disconnect();
                    }
                })
            })
        }).catch(function (error) {
            console.log('Error has occured when trying to create a manufacturer. Log:');
            console.log(error);
        })
}

function provideIdentitiesToManufacturers(manufacturerData) {

    return bnUtil.connection.issueIdentity('outbound.logistics.participant.Manufacturer#' + manufacturerData.manufactureId,
        manufacturerData.manufactureName + '@outbound-logistics', 'true').then(function (identity) {
            return importCardForIdentity(manufacturerData.manufactureName + '@outbound-logistics', identity);
        }).catch(function (error) {
            console.log(error);
        });
}

function importCardForIdentity(cardName, identity) {
    const connectionProfile = {
        "name": cardName,
        "type": "hlfv1",
        "orderers": [{ "url": "grpc://localhost:7050" }],
        "ca": {
            "url": "http://localhost:7054",
            "name": "ca.org1.example.com"
        },
        "peers": [{ "requestURL": "grpc://localhost:7051", "eventURL": "grpc://localhost:7053" }],
        "channel": "composerchannel",
        "mspID": "Org1MSP",
        "timeout": 300
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
