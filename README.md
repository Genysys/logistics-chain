Highly recommend running on Ubuntu. All instructions here will be for Ubuntu.

# Requirements
Operating Systems: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
Docker Engine: Version 17.03 or higher
Docker-Compose: Version 1.8 or higher
Node: 8.9 or higher (note version 9 is not supported)
npm: v5.x
git: 2.9.x or higher
Python: 2.7.x
A code editor of your choice, we recommend VSCode.

# Setting up the environment
To set up on Ubuntu, run the following commands:

## Pre-Req Software

`curl -O https://hyperledger.github.io/composer/prereqs-ubuntu.sh`
`chmod u+x prereqs-ubuntu.sh`

`./prereqs-ubuntu.sh`

## Composer Tools 
`npm install -g composer-cli`
`npm install -g composer-rest-server`
`npm install -g generator-hyperledger-composer`
`npm install -g yo`

## Fabric Tools
`mkdir ~/fabric-tools && cd ~/fabric-tools`

`curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip`
`unzip fabric-dev-servers.zip`

TODO: Write a script to automate this.

# Running for the first time
`cd ~/fabric-tools`
`./startFabric.sh`
`./createPeerAdminCard.sh`

# Add a Manufacturer: 
composer participant add -d '{"$class":"outbound.logistics.participant.Manufacturer","companyId":"NI","manufacturerName":"Nissan"}' -c admin@outbound-logistics
Participant was added to participant registry.

