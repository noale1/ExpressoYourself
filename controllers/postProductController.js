require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});

const twitterClient = client.readWrite;

const postProduct = async (product) => {
    const POST_TEMPLATE = `New product added: ${product.name} for $${product.price}!`;

    try {
        await twitterClient.v2.tweet(POST_TEMPLATE);
    } catch (e) {
        console.log(e)
    }
};

exports.postProduct = postProduct;