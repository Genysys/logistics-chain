const bnUtil = require('./connection-util');
bnUtil.connect(viewAllCars, 'NML@outbound-logistics');

function viewAllCars() {
    return bnUtil.connection.query('AllCars').then((results) => {
        console.log(results);
    })
}