#!/bin/bash 
echo "Running Outbound Logistics network for the first time."
cd ~/fabric-tools
./stopFabric.sh
./teardownFabric.sh
./startFabric.sh
cd ~/workspace/logistics-chain/dist
sh ./firstRun.sh
cd ~/workspace/logistics-chain/utility-scripts
node createManufacturers.js
node createLogisticsTeam.js
node createPlants.js
node manufactureCar.js
node createRelevantNissanNodes.js
node createPortCompanyAndNode.js
node createDealerCompanyAndNode.js
