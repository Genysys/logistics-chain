// Need the card store instance
const FileSystemCardStore = require('composer-common').FileSystemCardStore;
const AdminConnection = require('composer-admin').AdminConnection;

// Used as the card for all calls
const   cardNameForPeerAdmin   = "PeerAdmin@hlfv1";
const   cardNameForNetworkAdmin   = "admin@outbound-logistics";
const   appToBePinged = "outbound-logistics";

// 1. Create instance of file system card store
const cardStore = new FileSystemCardStore();

// 2. Create Admin Connection object for the fabric
const cardStoreObj = { cardStore: cardStore };
const adminConnection = new AdminConnection(cardStoreObj);

// 3. Initiate a connection as PeerAdmin
return adminConnection.connect(cardNameForPeerAdmin).then(function(){
    console.log("Admin Connected Successfully!");
   listBusinessNetwork();
}).catch((error)=>{
    console.log(error);
});


// Extracts information about the network
function listBusinessNetwork(){
    // 4. List the network apps
    adminConnection.list().then((networks)=>{
        console.log("Successfully retrieved the deployed Networks: ",networks);
        // 5. Disconnect
        adminConnection.disconnect();
        reconnectAsNetworkAdmin();
    }).catch((error)=>{
        console.log(error);
    });
}

// Ping the network
function reconnectAsNetworkAdmin(){

    // 6. Reconnect with the card for network admin
    return adminConnection.connect(cardNameForNetworkAdmin).then(function(){
        console.log("Network Admin Connected Successfully!!!");
        // 7. Ping the BNA 
        adminConnection.ping(appToBePinged).then(function(response){
            console.log("Ping response: ",response);
            // 8. Disconnect
            adminConnection.disconnect();
        }).catch((error)=>{
            console.log(error);
        });
    });

    
}







// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// let businessNetworkConnection = new BusinessNetworkConnection();
// return businessNetworkConnection.connect('admin@outbound-logistics')
//     .then(() => {
//         return businessNetworkConnection.getParticipantRegistry('outbound.logistics.participant');
//     })
//     .then((participantRegistry) => {
//         let factory = businessNetworkConnection.getFactory();
//         let participant = factory.newResource('outbound.logistics.participant', 'Manufacturer', 'RN');
//         participant.companyName = 'Renault';
//         return participantRegistry.add(participant);
//     })
//     .then(() => {
//         return businessNetworkConnection.disconnect();
//     })
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });