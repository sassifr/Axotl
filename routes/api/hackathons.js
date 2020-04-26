//Require packages
const express = require('express');
const router = express.Router() //allows us to use this file as a router


//Require the hackathon profile
const Hackathon = require('../../models/Hackathon');


//POST      /api/hackathons/create
//Action    create a hackathon
//PUBLIC

router.post('/create', async(req, res, next) => {
    try {
        if(!req.user){
            return res.status(401);
        }
        //Check to see if hackathon with the same name exists
        const name = await Hackathon.findOne({title: req.body.title});

        if (name) {
            return res.status(400).json({
                errors: [{ msg: 'Hackathon with that name already exists' }]
            })
        }

        //Take the info from the body to create new hackathon
        //start date, end date, title
        
        const { recipient,
                startDate,
                endDate,
                title,
                description,
                website,
                donations,
                winners
            } = req.body;
        
        //create new hackathon
        const newHackathon = new Hackathon({
            recipient,
            title,
            startDate,
            endDate,
            description,
        });

        //add in the optional fields if they exist
        if(website) newHackathon['websiste'] = website;
        
        if(donations){
            newHackathon.donations = [];
            donations.forEach(donation => {
                //takes out each individual donation
                //

                //grabs the fields that we want from the donation
                const {
                    type,
                    quantity,
                    description,
                    received
                } = donation;

                //creates an object that will be filled with the fields of donation
                const addDonation = {};
                addDonation.type = type;


                //adding in the hackathon donations fields
                if(quantity) addDonation['quantity'] = quantity;
                if(description) addDonation['description'] = description;
                

                //filling in anything that has been received
                //Breaking down the recieved array into smaller components and adding that to the addDonation
                if(received){

                    //makes it an array to be added
                    addDonation.received = [];

                    received.forEach(reception => {
                        const receptionPackage = {};
                        const {
                            sponsor,
                            quantity,
                            description
                        } =  reception;
        
                        //adds the files, none of htese are required, so we'll do a front end check for them
                        if(sponsor) receptionPackage.sponsor = sponsor;
                        if(quantity) receptionPackage.quantity = quantity;
                        if(description) receptionPackage.description = description;

                        addDonation.received.push(receptionPackage);
                    })
                   
                }

                newHackathon.donations.push(addDonation);
            });
            
        };

        if(winners){
            //creates the array to add the winners to 
            newHackathon.winners = [];

            winners.forEach(winner => {
                //extracts the required components from each winner
                const {teamName, awardTitle, prizeWon} = winner;

                //adds the object that the winner would be added to
                const addWinners = {teamName, awardTitle};

                if(prizeWon) addWinners.prizeWon = prizeWon;

                newHackathon.winners.push(addWinners);
            });
        }

        await newHackathon.save();
        res.json(newHackathon);


    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



//PUT       /api/hackathons/edit/:id
//Action    edit existing data in a hacakthon that is not winner or donations
//PUBLIC    (will go private soon)

router.put('/edit-general/:id', async (req, res, next) => {
    //gets the ID of the hackathon to be modified
    const hackathonId = req.params.id;

    try{
        //grabs the Hackathon that is associated with the Id
        let hackathon = await Hackathon.findOne({_id: hackathonId});
        
        //Grabs all the parameters that are modified
        const editParams = req.body;

        //updates the hackathon
        hackathon = await Hackathon.findOneAndUpdate({_id: hackathonId}, {$set: editParams})

        res.status(200).json(hackathon);
    } catch(err){
        console.error(err);
        res.status(500).send('Server Error or hackathon not found');
    }

})


//PUT       /api/hackathons/edit/donations/:id
//Action    edit the donations that the group has recieved
//PUBLIC    (will go private soon)
router.put('/edit/donations/:id', async(req, res, next) => {
    
});

module.exports = router;