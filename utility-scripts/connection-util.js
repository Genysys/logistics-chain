'use strict';
module.exports = {
    // Properties used for creating instance of the BN connection
    cardStore : require('composer-common').FileSystemCardStore,
    BusinessNetworkConnection : require('composer-client').BusinessNetworkConnection,
    cardName : "admin@outbound-logistics",

    // Holds the Business Network Connection
    connection: {},

    // 1. This is the function that is called by the app
    connect : function(callback, cardName) {
        // Create instance of file system card store
        if(cardName != null) {
            this.cardName = cardName;
        }
        const cardStore = new this.cardStore();
        this.connection = new this.BusinessNetworkConnection({ cardStore: cardStore });

        // Invoke connect
        return this.connection.connect(this.cardName).then(function(){
            callback();
        }).catch((error)=>{
            callback(error);
        });
    },

    // 2. Disconnects the bn connection
    disconnect : function(callback) {
        return this.connection.disconnect();
    },

    // 3. Pings the network
    ping : function(callback){
        return this.connection.ping().then((response)=>{
            callback(response);
        }).catch((error)=>{
            callback({}, error);
        });
    },

    getCardStore : function (callback) {
        return this.cardStore;
    }
 }

