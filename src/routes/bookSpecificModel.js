let CarModel = require('../models/carModel.model')
let Vehicle = require('../models/vehicle.model')
let Booking = require('../models/booking.model')
let Customer = require('../models/customer.model')
let express = require('express')
let router = express.Router()

async function doBooking(element, data, booked){
    return new Promise(async (resolve, reject) => {
        try{

            let custPhNo = data.cust_phno;
            let startDate = new Date(data.s_date);
            let days = data.duration - 1;
            let endDate = new Date();
            endDate.setDate(startDate.getDate() + days);
            let bookingRec = new Booking({
                vNo: element,
                custPhoneNo: custPhNo,
                issueDate: startDate,
                returnDate: endDate
            })

            // checking if this customer already exist 
            const customerDoc = await Customer.find({ custPhoneNo: custPhNo });

            if(customerDoc.length){
                // if customer already exists

                booked = true;
                const bookinRecRet = await bookingRec.save();

                if (!bookinRecRet || bookinRecRet.length === 0) {
                    // in case booking record isnt created properly
                    resolve(status(500).send(bookinRecRet));
                }

                // updating value of isBooked of the vehicle that has been booked
                const vehicleRec = await Vehicle.findOneAndUpdate({ vNo: element },
                    { isBooked: true },
                    { safe: true, new: true });
                
                resolve(bookinRecRet);
            }
            else{

                // create customer first
                let customerRec = new Customer({
                    custPhoneNo: custPhNo,
                    fullName: data.cust_name
                });

                const customerRecRet = await customerRec.save();

                if (!customerRecRet || customerRecRet.length === 0) {
                    // in case customer record isnt created properly
                    resolve(status(500).send(bookinRecRet));
                }

                booked = true;
                const bookinRecRet = await bookingRec.save();

                if (!bookinRecRet || bookinRecRet.length === 0) {
                    // in case booking record isnt created properly
                    resolve(status(500).send(bookinRecRet));
                }

                // updating value of isBooked of the vehicle that has been booked
                const vehicleRec = await Vehicle.findOneAndUpdate({ vNo: element },
                    { isBooked: true },
                    { safe: true, new: true });
                
                resolve(bookinRecRet);
            }

        }
        catch(err){
            console.log(err);
            resolve(err);
        }
        resolve(null);
    })
}
async function checkAndDoBooking(element, data, booked){
    return new Promise(async (resolve, reject)=> {
        try{

            // fetching all the booking for Vehcile No. element
            const bookingDoc = await Booking.find({ vNo: element });

            // declaring the dates required
            let startDate = new Date(data.s_date);
            let days = data.duration - 1;
            let endDate = new Date();
            endDate.setDate(startDate.getDate() + days);

            if(bookingDoc.length){
                // if vehicle already has bookings

                // checking if required dates are not overlapping with any other booking
                let available = true;
                for (const booking_ in bookingDoc) {
                    let issDate = booking_.issueDate;
                    let retDate = booking_.returnDate;
                    if (!((retDate < startDate) || (endDate < issDate))) {
                        available = false;
                        break;
                    }
                }

                if(available){
                    // do the booking if available 
                    const bookingObj = await doBooking(element, data, booked);
                    resolve(bookingObj);
                }
            }
            else{
                // vehicle doesnt have any booking
                const bookingObj = await doBooking(element, data, booked);
                resolve(bookingObj);
            }

        }
        catch(err){
            console.log(err);
            resolve(err);
        }
        resolve(null);
    })
}

router.post('/bookCar', async function (req, res) {
    if (!req.body) {
        return res.status(400).send('Request body is missing');
    }
    let data = req.body;
    let car_model = data.model;
    CarModel.find({ name: car_model }, async function (err, doc) {
        if (err) {
            return res.status(500).send(err);
        }
        else if (doc.length) {
            let booked = false;
            let vehicle_list = doc[0].vehicles;
            let counter = 0;
            for (const element in vehicle_list) {
                counter++;
                const ans = await checkAndDoBooking(vehicle_list[element], data, booked);
                if (ans) {
                    return res.send(ans);
                }
            }
            if(!booked) {
                return res.send(`Sorry we don't have any car of model : ${car_model} available for ${data.duration} days from ${new Date(data.s_date).toDateString()}`)
            }
        }
        else {
            return res.send(`Sorry we don't have any car of model : ${car_model} available`)
        }
    })

})

module.exports = router;