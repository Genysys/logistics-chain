const bnUtil = require('./connection-util');
let vehicle = require('./vehicle-transport-plan.json')

bnUtil.connect(startAuction, 'EULogisticsNissan@outbound-logistics');

function startAuction() {
    let bnDef = bnUtil.connection.getBusinessNetwork();
    let factory = bnDef.getFactory();

    bnUtil.connection.getAssetRegistry("outbound.logistics.auction.TransportContractAuction")
        .then((transportContractAuctionRegistry) => {
            let transportPlanContract = factory.newResource('outbound.logistics.auction', 'TransportContractAuction', 'CONTRACT1');
            
        })
}