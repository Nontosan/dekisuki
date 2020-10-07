const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');
const Jimp = require('jimp');

const client = new Discord.Client();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith('!lol')) {
        const champname = msg.content.split(' ')[1];
        
        request(`https://www.leaguespy.gg/league-of-legends/champion/${champname}/stats`, (error, response, html) => {
    
            if (!error && response.statusCode == 200) {
            
                //Load html
                const $ = cheerio.load(html);
                
                //Champ header
                const champPic = $('.champ__header__left__radial').find('img').toArray()[0].attribs.src;
                const champRole_Raw = $('.overlay').find('img').toArray();
                const champRole = `https://www.leaguespy.gg${champRole_Raw[0].attribs.src}`;
                const champHeader = $('.champ__section__header').first().text().split('\n\t\t\t\t\t')[2].trimRight();
                const champStat = $('.champ__section__header').first().text().split('\n\t\t\t\t\t')[3];

                //Primary Rune
                const rune_primary = $('.rune-block__primary').find('img').toArray();
                const rune_header_pic = `https://www.leaguespy.gg${rune_primary[0].attribs.src}`;
                //const rune_header_name = ($('.rune-block.rune-block--new').first().text().replace(/\s\s+/g, '!').split('!')[1]);
                const rune_keystone_pic = rune_primary[1].attribs.src;
                //const rune_keystone_name = rune_primary[1].attribs.alt;
                const rune_sub1_pic = rune_primary[2].attribs.src;
                //const rune_sub1_name = rune_primary[2].attribs.alt;
                const rune_sub2_pic = rune_primary[3].attribs.src;
                //const rune_sub2_name = rune_primary[3].attribs.alt;
                const rune_sub3_pic = rune_primary[4].attribs.src;
                //const rune_sub3_name = rune_primary[4].attribs.alt;
                                
                //Secondary Rune
                const rune2_secondary = $('.rune-block__secondary').find('img').toArray();

                const rune2_header_pic = `https://www.leaguespy.gg${rune2_secondary[0].attribs.src}`; 
                //const rune2_header_name = $('.rune-block.rune-block--new').first().text().replace(/\s\s+/g, '!').split('!')[6];               
                const rune2_sub1_pic = rune2_secondary[1].attribs.src;
                //const rune2_sub1_name = rune2_secondary[1].attribs.alt;
                const rune2_sub2_pic = rune2_secondary[2].attribs.src;
                //const rune2_sub2_name = rune2_secondary[2].attribs.alt;                
                
                //Shardbar Rune
                const rune3_shardbar = $('.rune-block__fwrap').find('img').toArray();

                var rune3_1 = rune3_shardbar[0].attribs.src.slice(14).split('.')[0];
                var rune3_2 = rune3_shardbar[1].attribs.src.slice(14).split('.')[0];
                var rune3_3 = rune3_shardbar[2].attribs.src.slice(14).split('.')[0];
                        
                const app = async () => {
                    const bg = await Jimp.read('./BackGroundV2.png');
                    const rhp = await (await Jimp.read(rune_header_pic)).resize(40,40);
                    const rkp = await (await Jimp.read(rune_keystone_pic)).resize(75,75);
                    const rs1p = await (await Jimp.read(rune_sub1_pic)).resize(56,56);
                    const rs2p = await (await Jimp.read(rune_sub2_pic)).resize(56,56);
                    const rs3p = await (await Jimp.read(rune_sub3_pic)).resize(56,56);
                    const r2hp = await (await Jimp.read(rune2_header_pic)).resize(40,40);
                    const r2s1p = await (await Jimp.read(rune2_sub1_pic)).resize(56,56);
                    const r2s2p = await (await Jimp.read(rune2_sub2_pic)).resize(56,56);
                    const r31 = await Jimp.read(`./${rune3_1}.png`);
                    const r32 = await Jimp.read(`./${rune3_2}.png`);
                    const r33 = await Jimp.read(`./${rune3_3}.png`);

                    bg
                        .clone()
                        .composite(rhp, 11, 10)
                        .composite(rkp, -3.5, 56)
                        .composite(rs1p, 4, 142.5)
                        .composite(rs2p, 4, 218.5)
                        .composite(rs3p, 4, 294.5)
                        .composite(r2hp, 215, 10)
                        .composite(r2s1p, 208, 68)
                        .composite(r2s2p, 208, 144)
                        .composite(r31, 221, 230)
                        .composite(r32, 221, 275)
                        .composite(r33, 221, 320)
                        .write('./ChampRune.jpg');
                };
            
                app().then(function () {
                    const exampleEmbed = new Discord.RichEmbed()
                        .setColor('#cdf2e0')
                        .setAuthor(champHeader, champRole, `https://www.leaguespy.gg/league-of-legends/champion/${champname}/stats`)
                        .setDescription(champStat)
                        .setThumbnail(champPic)
                        .attachFiles(['./ChampRune.jpg'])
                        .setImage('attachment://ChampRune.jpg');
                    
                    msg.channel.send(exampleEmbed)
                });
            };
        });
    };
});

client.login('NTU2NDg5NTM5ODQxOTQ5NzA2.Xht3Ow.z6BHVcNfX5J8utHqlXdIYV9MIMo');