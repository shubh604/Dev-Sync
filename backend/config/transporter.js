const { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } = require("@getbrevo/brevo");
require("dotenv").config();

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

module.exports = apiInstance;