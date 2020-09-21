const updateDotenv = require("update-dotenv");
const dotenv = require("dotenv");
const fetch = require('node-fetch');

const endpoint = "https://id.twitch.tv/oauth2/token";

module.exports = async () => {
    console.log("Requesting a new one API key");

    const url = new URL(endpoint);
    url.searchParams.append("client_id", process.env.CLIENT_ID);
    url.searchParams.append("client_secret", process.env.CLIENT_SECRET);
    url.searchParams.append("grant_type", "client_credentials");

    const response = await fetch(url, { method: "POST" });

    const json = await response.json();
    const expiresDate = new Date();
    expiresDate.setSeconds(expiresDate.getSeconds() + json.expires_in - 604800);

    await updateDotenv({
        API_KEY: json.access_token,
        API_KEY_EXPIRES: expiresDate.getTime().toString()
    });
    dotenv.config();

    return json.access_token;
}
