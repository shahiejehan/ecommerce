import orderModel from "../model/orderModel.js";

// const stripe = new Stripe('_test_51OGyXySBCZwBaDZR7fm0JbG9cLT1nFzbOCtOTLEerGSE7XKhFeL6zPi1JREpugvYTiXbUlJtB0GoV6PG2u4jml0u002BPutVBS')

// export const orderRouteController = async (req, res) => {
//     const { token, totalPrice, currentUser, cardItems } = req.body;
//     try {
//         const customer = await stripe.customers.create({
//             email: token.email,
//             source: token,
//         })

//         const payment = await stripe.changes.create({
//             amount: totalPrice * 100,
//             currency: "INR",
//             customer: customer.id,
//             receipt_email: token.email
//         }, {
//             idempotencyKey: uuidv4()
//         });
//         if (payment) {
//             res.status(201).send({
//                 success: true,
//                 message: "payment successfull",
//                 payment

//             })
//         } else {

//             res.status(404).send({
//                 success: false,
//                 message: "payment failed"

//             })
//         }

//         }catch (error) {
//             res.status(500).send({
//                 success: false,
//                 message: "something went wrong  ....",
//                 error
//             })
//         }
//     }
