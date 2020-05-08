let CarModel = require('../models/carModel.model')
let Vehicle = require('../models/vehicle.model')
let express = require('express')
let router = express.Router()


router.post('/addCar', (req, res) => {
    if(!req.body) {
      return res.status(400).send('Request body is missing');
    }
    let data = req.body;
    let car_model = data.model;
    CarModel.find({name : car_model}, function(err, doc){
        if(err)
        {
            return res.status(500).send(err);
        }
        else if(doc.length){

            let vehicle_number = data.vehicle_no;
            let vehicleRecord = new Vehicle({
                vNo : vehicle_number,
                model : car_model,
                isBooked : false
            })

            vehicleRecord.save()
            .then(rec => {
                if(!rec || rec.length === 0) {
                    return res.status(500).send(rec)
                }
                CarModel.findOneAndUpdate({name : car_model},   
                    {$push: {"vehicles": vehicle_number}},
                    {safe: true, new : true},
                    function(err, doc) {
                         if(err){
                            return res.status(500).json(err);
                         }
                })
                res.status(201).send(rec)
                })
            .catch(err => {
                return res.status(500).json(err) 
            })

        }
        else{

            let vehicle_number = data.vehicle_no;
            let seating_capacity = data.capacity;
            let rent_perday = data.rent;
            let vehciles_list = [vehicle_number];

            let carModelRecord = new CarModel({
                name : car_model,
                capacity : seating_capacity,
                rentPerDay : rent_perday,
                vehicles : vehciles_list
            })

            carModelRecord.save()
            .then(rec => {
                if(!rec || rec.length === 0) {
                    return res.status(500).send(rec)
                }
                //res.status(201).send(rec)
            })
            .catch(err => {
                return res.status(500).json(err)
            })

            let vehicleRecord = new Vehicle({
                vNo : vehicle_number,
                model : car_model,
                isBooked : false
            })

            vehicleRecord.save()
            .then(rec => {
                if(!rec || rec.length === 0) {
                    return res.status(500).send(rec)
                }
                return res.status(201).send(rec)
                })
            .catch(err => {
                return res.status(500).json(err) 
            })
        }
    })
})

module.exports = router;