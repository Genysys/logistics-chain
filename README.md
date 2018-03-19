Highly recommend running on Ubuntu. All instructions here will be for Ubuntu.

# Requirements
* Operating Systems: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
* Docker Engine: Version 17.03 or higher
* Docker-Compose: Version 1.8 or higher
* Node: 8.9 or higher (note version 9 is not supported)
* npm: v5.x
* git: 2.9.x or higher
* Python: 2.7.x
Optionally: VSCode - get the Docker and Hyperledger Composer extensions.

# Setting up the environment
To set up on Ubuntu, run the following commands:

## Pre-Requisite Software
1. `curl -O https://hyperledger.github.io/composer/prereqs-ubuntu.sh`
2. `chmod u+x prereqs-ubuntu.sh`

3. `./prereqs-ubuntu.sh`

## Composer Tools 
* `npm install -g composer-cli`
* `npm install -g composer-rest-server`
* `npm install -g generator-hyperledger-composer`
* `npm install -g yo`

## Fabric Tools
1. `mkdir ~/fabric-tools && cd ~/fabric-tools`

2. `curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip`
3. `unzip fabric-dev-servers.zip`

TODO: Write a script to automate this.

# Running for the first time
## Starting Fabric and creating Peer Card
1. `cd ~/fabric-tools`
2. `./startFabric.sh`
3. `./createPeerAdminCard.sh`

## Running the project
4. CD into this repository and into the dist folder. e.g. `cd ~/logistics-chain/dist`
5. `sh ./firstRun.sh`

You can now run `composer-rest-server -c admin@outbound-logistics -n always -w true` to access the API as an admin. 

# Updating The Project
to make changes to a deployed network, run from the dist folder:
1. `composer archive create --sourceType dir --sourceName ../`
2. `composer network update -a ./outbound-logistics@0.0.1.bna -c admin@outbound-logistics`
3. `composer card delete -n admin@outbound-logistics`
4. `composer card import -f admin@outbound-logistics.card`

# Adding participants and issuing identities
You will likely wish to the run network as a specific participant to see how they can interact with the application. To do this, you need to add participants and create cards by issuing them from the correct authority. 

## Run Participant Scripts



## Manually Adding a Participant Example:
If you wish to create a participant by the command line manually, here is an example of ading a manufacturer and then importing their card.
### Add a Manufacturer: 
1. `composer participant add -d '{"$class":"outbound.logistics.participant.Manufacturer","companyId":"NI","manufacturerName":"Nissan"}' -c admin@outbound-logistics`
2. `composer identity issue -u Nissan -a outbound.logistics.participant.Manufacturer#Nissan -c admin@outbound-logistics`
3. `composer card import -f Nissan@outbound-logistics.card`
 
To run as a manufacturer: `composer-rest-server -c Nissan@outbound-logistics -n always -w true`

### Add a Plant:
1. `composer participant add -d '{"$class":"outbound.logistics.participant.Plant","companyId":"NMUK"}' -c Nissan@outbound-logistics`

