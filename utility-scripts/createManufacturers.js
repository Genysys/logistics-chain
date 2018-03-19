const bnUtil = require('./connection-util');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection
const cardStore = require('composer-common').FileSystemCardStore

let participantList = require('./participants.json') 
bnUtil.connect(setUp);

function setUp(error) {

    if (error) {
        console.log(error);
        process.exit(1);
    }

    let bnDef = bnUtil.connection.getBusinessNetwork();
    console.log("Received Definition from Runtime: ",
        bnDef.getName(), "  ", bnDef.getVersion());

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
        manufacturerData.manufactureName + '@outbound-logistics', {issuer: true}).then(function (identity) {
            return bnUtil.importCardForIdentity(manufacturerData.manufactureName + '@outbound-logistics', identity);
        }).catch(function (error) {
            console.log(error);
        });
}
