const express = require('express')
const fleek = require('@fleekhq/fleek-storage-js'); 
const faker = require('faker');
fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const config = require('./config')

var randomColor = require('randomcolor');
const colorNames = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']
let cactusSvg = require('./cactus.js')

random1To = (number) => {
    return Math.floor((Math.random() * number) + 1);
}

CactusColors = () => {
    let colorName = colorNames[random1To(7)]
     return [
        randomColor({
            luminosity: 'light',
            hue: colorName
        }),
        randomColor({
            luminosity: 'dark',
            hue: colorName
        }),
        randomColor({
            hue: colorNames[random1To(7)]
        })
    ]
}

function generateCactus(){
    let data = cactusSvg
    const cactusColors = CactusColors()
    data = data.replace(/#88b94d/g,cactusColors[0])
    data = data.replace(/#094704/g,cactusColors[1])
    data = data.replace(/#ff9f00/g,cactusColors[2])

    let original = new JSDOM(data)
    const EyeId = random1To(7)
    for (let eyeIndex = 1; eyeIndex <= 7; eyeIndex++) {
        if(eyeIndex != EyeId){
            original.window.document.getElementById(`Pair-of-eyes-${eyeIndex}`).remove()  
        }
    }
    const mouthId = random1To(5)
    for (let mouthIndex = 1; mouthIndex <= 5; mouthIndex++) {
        if(mouthIndex != mouthId){
            original.window.document.getElementById(`Mouth-${mouthIndex}`).remove()  
        }
    }
    const ornamentId = random1To(5)
    for (let ornamenIndex = 1; ornamenIndex <= 5; ornamenIndex++) {
        if(ornamenIndex != ornamentId){
            original.window.document.getElementById(`Ornament-${ornamenIndex}`).remove()  
        }
    }
    const svgData = original.serialize().replace(/<body>|<\/body>|<head>|<\/head>|<html>|<\/html>/g,'')
    return svgData
}

async function upload(id){
        let input = {
            apiKey: config.apiKey,
            apiSecret: config.apiSecret,
            key: `trigger/image/${id}.svg`,
            data: Buffer.from(generateCactus(), 'utf8')
          };  
        const image = await fleek.upload(input);
        console.log(image.hash)
        const metadata = {
            name: faker.name.findName(),
            description: faker.lorem.paragraph(),
            image:`ipfs/${image.hash}`
        }
        input.key = `trigger/metadata/${id}.json`
        input.data = JSON.stringify(metadata)
        await fleek.upload(input);

}

const app = express()
app.use(express.json())
app.get('/', (req, res) => { 
    res.setHeader('Content-Type', 'text/html')
    res.send(generateCactus())
})
app.post('/', (req, res) => {
    console.log(req.body) 
    upload(req.body.id)
    res.json(req.body)
})
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Application listening on port ${port}`))