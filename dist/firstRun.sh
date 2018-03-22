#!/bin/bash 
echo "Running Outbound Logistics network for the first time."
composer archive create --sourceType dir --sourceName ../
composer network deploy -a ./outbound-logistics@0.0.1.bna -c PeerAdmin@hlfv1 -A admin -S adminpw
composer card delete -n admin@outbound-logistics
composer card import -f admin@outbound-logistics.card