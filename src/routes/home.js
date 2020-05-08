let express = require('express')
let router = express.Router()

let drive = "https://bit.ly/insomnia_collection";
router.get('/', (req, res) =>{
    res.send(`Welcome to Car Rental. Download Insomnia Collection : ${drive}`)
})

module.exports = router;