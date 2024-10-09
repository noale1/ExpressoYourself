const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const jwt = require('jsonwebtoken');
const auth = require("../controllers/authController")
const mongoose = require('mongoose');

// List all orders
exports.list_orders = async (req, res) => {
  try {
    const { productName, minPrice, maxPrice, orderDate, userId } = req.query;

    let query = {};

    if (productName) {
        query['items.productName'] = { $regex: new RegExp(productName.trim(), 'i') };
    }

    if (minPrice || maxPrice) {
        query.totalPrice = {};
        if (minPrice) query.totalPrice.$gte = parseFloat(minPrice);
        if (maxPrice) query.totalPrice.$lte = parseFloat(maxPrice);
    }

    if (orderDate) {
        const parsedDate = new Date(orderDate);
        if (!isNaN(parsedDate)) {
            query.orderDate = { 
                $gte: new Date(parsedDate.setUTCHours(0, 0, 0, 0)), 
                $lt: new Date(parsedDate.setUTCHours(23, 59, 59, 999))
            };
        }
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        query.user = userId;
    }

    const orders = await Order.find(query).populate({
      path: 'user',
      model: 'User',
  });;

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.checkout = async (req, res) => {
    const cart = req.body.cart;
    const userDetails = req.body.userDetails; 
    const token = req.headers['cookie']?.split('=')[1]
    const usernamefromjwt = auth.getUserFromToken(token)
    console.log(usernamefromjwt)
    let totalPrice = 0;
    let user;  

    try {        
        user = await User.findOne({username: usernamefromjwt}); 
        console.log('user',user)
        if (!user) {
            return res.status(403).send('Invalid token');
        }
        
    } catch (err) {
      console.log(err)
        return res.status(403).send('Invalid token');
    }

    try {

        // check if all products have enough quantity in stock
        for (const item of cart) {
            const product = await Product.findById(item.id);
            if (!product) {
                return res.status(404).send(`Product with id ${item.id} not found`);
            }
            if (product.price !== item.price) {
              return res.status(500).send(`Product price changed for ${product.name}`);
            }
            if (product.quantity <= item.quantity) {
                return res.status(500).send(`Not enough stock for product ${product.name}`);
            }
        }

        // update product quantities 
        for (const item of cart) {
            const product = await Product.findById(item.id);
            product.quantity -= item.quantity;
            if (product.quantity === 0) product.inStock = false
            await product.save();
        }

        // calc total amount
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        const newOrder = new Order({
            user: user._id,  
            items: cart.map(item => ({
                productId: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalPrice,
            deliveryDetails: {
                address: userDetails.address,
                city: userDetails.city,
                country: userDetails.country,
                zip: userDetails.zip
            }
        });

        await newOrder.save();
        res.status(200).json({ message: 'Order created successfully!', orderId: newOrder._id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error });
    }
};

exports.getUserHistoryOrders = async (req, res) => {
    // const username = req.params.username;
    const token = req.headers['cookie']?.split('=')[1]
    const username = auth.getUserFromToken(token) // Attach user info to request

    const userId = await User.find({ username });


    try {
        // Find the order by user (or session ID)
        const orders = await Order.findById({ user: userId }); 
        console.log(orders);
        if (!orders) {
            return res.status(404).json({ message: 'No active orders found' });
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
};

exports.get_top_saled_product_graph = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.productName", 
                    totalQuantity: { $sum: "$items.quantity" } 
                } 
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 }
        ]);
        res.json(topProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top products' });
    }
};

exports.getExchangeAPIKey = (req, res) => {
    const apiKey = process.env.EXCHANGE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Exchange API key is missing' });
    }
    return res.json({ apiKey });
};
exports.get_order_count_per_day_last_week_graph = async (req, res) => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); 
  
      const ordersPerDay = await Order.aggregate([
        {
          $match: {
            orderDate: { $gte: oneWeekAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } 
            },
            count: { $sum: 1 } 
          }
        },
      ]);
  
      res.json(ordersPerDay);
    } catch (error) {
      console.error('Error aggregating orders per day:', error);
      res.status(500).send('Server Error');
    }
  };

  exports.get_sales_per_day_last_week = async (req, res) => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); 
  
      const moneyPerDay = await Order.aggregate([
        {
          $match: {
            orderDate: { $gte: oneWeekAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } 
            },
            totalMoney: { $sum: "$totalPrice" } 
          }
        },
      ]);
  
      res.json(moneyPerDay);
    } catch (error) {
      console.error('Error aggregating total money per day:', error);
      res.status(500).send('Server Error');
    }
  };
