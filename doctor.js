const express = require("express");
const app = express();
const port = 3000;
const users = [{                //array of object(s) with nested objects within. 
    name: "John",
    kidneys: [{
        healthy: false,
    }, {
        healthy: true
    }]
}]

app.use(express.json());

app.get('/', function (req, res) {
    const userKidney = users[0].kidneys;  //stores the data of the kidney object in the users array.
    console.log(userKidney);
    const numberOfKidneys = userKidney.length;
    let numberOfHealthyKidneys = 0;
    for (let i = 0; i < userKidney.length; i++) {
        if (userKidney[i].healthy) {
            numberOfHealthyKidneys = numberOfHealthyKidneys + 1;
        }
    }
    const numberOfUnhealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;
    res.json({
        numberOfKidneys,
        numberOfHealthyKidneys,
        numberOfUnhealthyKidneys
    }
    )
})

app.post('/', function (req, res) {
    const isHealthy = req.body.isHealthy;    //requsts isHealthy from the body in postman
    users[0].kidneys.push({                  //pushes the input taken from postman's body
        healthy: isHealthy                   // "isHealthy": true -> written in postman as json file and so a healthy kidney gets added to users[0].kidneys
    })
    res.json({
        msg: "Done!"                         //on updating post requests, get requests also get updated.
    })
})

app.put('/', function (req, res) {
    for (let i = 0; i < users[0].kidneys.length; i++) {
        users[0].kidneys[i].healthy = true;  //sets all the kidneys health to true
    }
    res.json({});                            //need to write else the put request will hang in postman. it basically returns an empty object.
})

function isThereAnyUnhealthyKidney() {           //to check if there's an unhealthy kidney. pretty self explanatory.
    let atLeastOneUnhealthyKidney = false;
    for (let i = 0; i < users[0].kidneys.length; i++) {
        if (!users[0].kidneys[i].healthy) {
            atLeastOneUnhealthyKidney = true;
        }
    }
    return atLeastOneUnhealthyKidney
}

app.delete('/', function (req, res) {            //if there are unhealthy kidneys then delete else send a 411 status code.
    if (isThereAnyUnhealthyKidney()) {
        const newKidneys = [];                   //empty array
        for (let i = 0; i < users[0].kidneys.length; i++) {
            if (users[0].kidneys[i].healthy) {
                newKidneys.push({
                    healthy: true
                })
            }
        }
        users[0].kidneys = newKidneys;           //now all the unhealthy kidneys are deleted and healthy ones are stored in users[0].kidneys
        res.json({ msg: "Done!" })
    }
    else {
        res.status(411).json({
            msg: "you have no bad kidneys."
        })
    }

})


app.listen(3000);