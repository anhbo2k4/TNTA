const paypal = require('@paypal/checkout-server-sdk');

let clientId = "ARO5FHP1XAghDvDNNLDV4O2ve7h4p5nPJhLh_ml24uaOTDAcD6Lj8qfwR90OIWPqztQ6crEuOja-ZUes";
let clientSecret = "ENcL1IznB5E-xgNLXsLbtCsyJDskfMFD_OAA3mJVhqzwwjjw_ZA768T9MgHU87M2YLTqC6S2KV9hI7Ma";

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };