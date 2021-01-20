const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('dotenv').config();
let Imodule = require('./insults.js');
const replies = Imodule.replies;
const fetch = require('node-fetch');
client.login(process.env.TOKEN);

const needle = require('needle');

// The code below sets the bearer token from your environment variables
// To set environment variables on Mac OS X, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.BEARERTOKEN;

const endpointUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

async function getRequest() {
    // Edit query parameters below
    const params = {
        user_id: 'some_id',
        count: '1',
        include_rts: 'true',
        query: 'from:some_user ',
        'tweet.fields':
            'attachments,author_id,created_at,in_reply_to_user_id,referenced_tweets,source',
    };

    const res = await needle('get', endpointUrl, params, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });

    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}



//commandide objekt
client.on('ready', () => {
    //const Guilds = client.guild.cache.channels
    //console.log(client.guilds);
    console.log('ready');
    let d = new Date();
    console.log(`Bot activated ${d.getHours()}:${d.getMinutes()}`);
    let idArr = [];
    setInterval(logTweet, 10000);
    async function logTweet() {
        try {
          
            //let userResponse = await fetch(url);
            const response = await getRequest();
            console.log(response[0].text);
            let latestTweet = response[0];

            //console.log(response.data[0]);
            //console.log(latestTweet);
            console.log(idArr.slice(-1));
            console.log(latestTweet.text);
            //console.log(res.body);

            if (latestTweet.id != idArr.slice(-1)) {
                let de = new Date();
                console.log(
                    `Tweets logged at ${de.getHours()}:${de.getMinutes()}`
                );

                client.guilds.cache.forEach((guild) => {
                    guild.channels.cache
                        .find(
                            (channel) => channel.name === 'shaun-norris-tweets'
                        )
                        .send(
                            ` https://twitter.com/statuses/${latestTweet.id_str}`
                        );
                });
               
                idArr.push(latestTweet.id);
                
            } else {
                console.log('no new tweets');
                let de = new Date();
                console.log(
                    `Tweets not made ${de.getHours()}:${de.getMinutes()}`
                );
            }
        } catch (error) {
            console.log(error);
        }
    }
});

client.on('message', (message) => {
    //Do something else

});
