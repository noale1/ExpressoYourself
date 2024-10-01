require('dotenv').config();
const Twitter = require('twitter-api-v2').default;

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const postProduct = async (product) => {
    console.log("REACHED 1");
    const POST_TEMPLATE = `New product added: ${product.name} for $${product.price}!`;
    console.log("REACHED 2");

    try {
        await client.v2.tweet(POST_TEMPLATE);
        console.log("Tweet posted successfully");
    } catch (error) {
        console.error("Error posting tweet:", error);
    }
};

exports.postProduct = postProduct;