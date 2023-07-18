//JWT Token For Test User
let jwtToken = '';

//User API test have to be ran first to get the JWT Token
require('./test/userapi.js');
require('./test/serverapi.js');

//Exit after tests are complete
after(() => {
    process.exit();
});