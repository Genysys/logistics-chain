'use strict';
module.exports = {
    // Properties used for creating instance of the BN connection
    cardStore: require('composer-common').FileSystemCardStore,
    BusinessNetworkConnection: require('composer-client').BusinessNetworkConnection,
    AdminConnection: require('composer-admin').AdminConnection,
    IdCard: require('composer-common').IdCard,
    cardName: "admin@outbound-logistics",

    // Holds the Business Network Connection
    connection: {},
    adminConnection: {},

    // 1. This is the function that is called by the app
    connect: function (callback, cardName) {
        // Create instance of file system card store
        if (cardName != null) {
            this.cardName = cardName;
        }
        const cardStore = new this.cardStore();
        this.connection = new this.BusinessNetworkConnection({ cardStore: cardStore });
        this.adminConnection = new this.AdminConnection();

        // Invoke connect
        return this.connection.connect(this.cardName).then(function () {
            callback();
        }).catch((error) => {
            callback(error);
        });
    },

    // 2. Disconnects the bn connection
    disconnect: function (callback) {
        return this.connection.disconnect();
    },

    // 3. Pings the network
    ping: function (callback) {
        return this.connection.ping().then((response) => {
            callback(response);
        }).catch((error) => {
            callback({}, error);
        });
    },

    getCardStore: function (callback) {
        return this.cardStore;
    },

    importCardForIdentity(cardName, identity) {
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
        const card = new this.IdCard(metadata, connectionProfile);
        console.log("Issuing card for " + identity.userID + "...");
        return this.adminConnection.importCard(cardName, card)
            .catch((error) => {
                console.log(error) 
            });
    },

    provideIdentity(namespace, cardName, canCreateIdentities) {
        return this.connection.issueIdentity(namespace + '#' + cardName,
            cardName + '@outbound-logistics', {issuer: canCreateIdentities}).then((identity) => {
                console.log(identity);
                return this.importCardForIdentity(cardName + '@outbound-logistics', identity);
            }).catch(function (error) {
                console.log(error);
            });
    }

}

