const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const jwt = require('jsonwebtoken');

// List all orders
exports.list_orders = async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
};


exports.checkout = async (req, res) => {
    const cart = req.body.cart; 
    const userDetails = req.body.userDetails; 
    const token = req.headers['cookie']?.split('=')[1];
    
    let totalPrice = 0;
    let user;  

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        user = await User.findById(userId); 

        if (!user) {
            return res.status(403).send('Invalid token');
        }
        
    } catch (err) {
        return res.status(403).send('Invalid token');
    }

    try {

        // check if all products have enough quantity in stock
        for (const item of cart) {
            const product = await Product.findById(item.id);
            if (!product) {
                return res.status(404).send(`Product with id ${item.id} not found`);
            }
            if (product.quantity < item.quantity) {
                return res.status(500).send(`Not enough stock for product ${product.name}`);
            }
        }

        // update product quantities 
        for (const item of cart) {
            const product = await Product.findById(item.id);
            product.quantity -= item.quantity;
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

exports.getUserCart = async (req, res) => {
    const user = req.params.user;

    try {
        // Find the order by user (or session ID)
        const order = await Order.findOne({ user }); 
        if (!order) {
            return res.status(404).json({ message: 'No active order found' });
        }
        res.json(order);
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
