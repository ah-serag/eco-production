const paymobService = require("./paymob.service");
const pool = require("../../config/condb");
const { integrationIdWallet, integrationIdCard } = require("../../config/paymob.config");
const axios = require("axios");
const bcrypt =  require("bcrypt"); 
const sendMailNodemailer = require("../../config/nodemailer");
const { orderConfirmationEmail } = require("../../config/orderConfirmationEmail");






const getOrCreateUser = async (client, userId, billingData) => {
  if (userId) return userId;

  const userCheck = await client.query(
    "SELECT id FROM users WHERE email = $1",
    [billingData.email]
  );

  if (userCheck.rows.length > 0) {
    return userCheck.rows[0].id;
  }

  const password_hash = await bcrypt.hash(billingData.phone_number, 10);
  
  const newGuest = await client.query(
    `INSERT INTO users (full_name, email, role, is_active, password_hash) 
     VALUES ($1, $2, 'guest', true, $3) RETURNING id`,
    [
      `${billingData.first_name} ${billingData.last_name}`,
      billingData.email,
      password_hash
    ]
  );

  return newGuest.rows[0].id;
};



const addBillingDataToUser = async (client, userId, billingData) => {

  const checkResult = await client.query(
    "SELECT id FROM users_billing_data WHERE user_id = $1 AND email = $2",
    [userId, billingData.email]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  const insertResult = await client.query(
    `INSERT INTO users_billing_data (
      user_id, first_name, last_name, email, phone_number, city, state, street, building
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [
      userId,
      billingData.first_name,
      billingData.last_name,
      billingData.email,
      billingData.phone_number,
      billingData.city,
      billingData.state,
      billingData.street,
      billingData.building
    ]
  );

  return insertResult.rows[0].id;
};



const calculateTotalWithDiscount = async  (totalAmount, couponCode) => {
    try {
        // 1. Basic check if coupon code is provided
        if (!couponCode) {
            return {
                success: true,
                totalWithDiscount: totalAmount,
                discountApplied: 0,
                message: "No coupon provided"
            };
        }

        // 2. Fetch coupon from PostgreSQL
        // Replace 'pool.query' with your actual database connection logic
        const query = `
            SELECT * FROM coupons 
            WHERE code = $1 AND is_active = TRUE
            LIMIT 1
        `;
        const result = await pool.query(query, [couponCode]);
        const coupon = result.rows[0];

        // 3. Validation Chain
        if (!coupon) {
            throw new Error("Invalid or inactive coupon code.");
        }

        const now = new Date();
        if (new Date(coupon.expiry_date) < now) {
            throw new Error("This coupon has expired.");
        }

        if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
            throw new Error("This coupon has reached its maximum usage limit.");
        }

        if (totalAmount < parseFloat(coupon.min_order_value)) {
            throw new Error(`Minimum order value of ${coupon.min_order_value} is required for this coupon.`);
        }

        // 4. Calculate Discount
        let discountAmount = 0;
        const discountValue = parseFloat(coupon.discount_value);

        if (coupon.discount_type === 'percentage') {
            // Percentage Discount logic
            discountAmount = totalAmount * (discountValue / 100);
            
            // Check for Max Discount Cap
            if (coupon.max_discount_amount && discountAmount > parseFloat(coupon.max_discount_amount)) {
                discountAmount = parseFloat(coupon.max_discount_amount);
            }
        } else {
            // Fixed Amount Discount logic
            discountAmount = discountValue;
        }

        // 5. Final Safety Checks
        if (discountAmount > totalAmount) {
            discountAmount = totalAmount;
        }

        const totalWithDiscount = totalAmount - discountAmount;

        return {
            success: true,
            originalTotal: totalAmount,
            discountApplied: Number(discountAmount.toFixed(2)),
            totalWithDiscount: Number(totalWithDiscount.toFixed(2)),
            couponId: coupon.id,
            message: "Coupon applied successfully"
        };

    } catch (error) {
        // Return errors to be displayed under the input field in UI
        return {
            success: false,
            totalWithDiscount: totalAmount,
            discountApplied: 0,
            error: error.message
        };
    }
}


// const processOrderAndItems = async (client, userId, items, statu ,payment_provider ,billingData) => {


//   const productIds = items.map(item => item.id);
  
//   // Fetch active products
//   const productResult = await client.query(
//     `SELECT id, title, description, discount_price, stock 
//      FROM products 
//      WHERE id = ANY($1) AND is_active = true`,
//     [productIds]
//   );

//   const dbProducts = productResult.rows;

//   if (dbProducts.length !== items.length) {
//     throw new Error("Some products are missing or inactive");
//   }

//   let totalAmount = 0;
//   const processedItems = [];

//   // Validate stock and calculate total
//   for (const cartItem of items) {
//     const dbProduct = dbProducts.find(p => p.id === cartItem.id);
//     const quantity = Number(cartItem.quantity) || 1;

//     if (quantity > dbProduct.stock) {
//       throw new Error(`Insufficient stock for product: ${dbProduct.title}`);
//     }

//     const price = Number(dbProduct.discount_price);
//     totalAmount += price * quantity;

//     processedItems.push({
//       id: dbProduct.id,
//       title: dbProduct.title,
//       description: dbProduct.description,
//       price,
//       quantity
//     });
//   }

//   // Insert main order
//   const orderResult = await client.query(
//     `INSERT INTO orders (user_id, status, total_amount, currency, payment_provider, billing_details)
//      VALUES ($1, $2 , $3, 'EGP', $4 ,$5 ) RETURNING id`,
//     [userId,statu , totalAmount ,payment_provider, JSON.stringify(billingData)]
//   );

//   const orderId = orderResult.rows[0].id;

//   // Insert order items
//   for (const pItem of processedItems) {
//     await client.query(
//       `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, product_title, product_description)
//        VALUES ($1, $2, $3, $4, $5, $6)`,
//       [orderId, pItem.id, pItem.quantity, pItem.price, pItem.title, pItem.description]
//     );
  
//     await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [pItem.quantity, pItem.id]);

//   }

//   return { orderId, totalAmount };
// };









// 1. Online Card Checkout


const processOrderAndItems = async (client, userId, items, statu, payment_provider, billingData, couponCode) => {
  const productIds = items.map(item => item.id);

  // 1. Fetch active products
  const productResult = await client.query(
    `SELECT id, title, description, discount_price, stock 
     FROM products 
     WHERE id = ANY($1) AND is_active = true`,
    [productIds]
  );

  const dbProducts = productResult.rows;

  if (dbProducts.length !== items.length) {
    throw new Error("Some products are missing or inactive");
  }

  let subtotal = 0;
  const processedItems = [];

  // 2. Validate stock and calculate original subtotal
  for (const cartItem of items) {
    const dbProduct = dbProducts.find(p => p.id === cartItem.id);
    const quantity = Number(cartItem.quantity) || 1;

    if (quantity > dbProduct.stock) {
      throw new Error(`Insufficient stock for product: ${dbProduct.title}`);
    }

    const price = Number(dbProduct.discount_price);
    subtotal += price * quantity;

    processedItems.push({
      id: dbProduct.id,
      title: dbProduct.title,
      description: dbProduct.description,
      price,
      quantity
    });
  }

  // 3. Handle Coupon Logic (if couponCode exists)
  let finalAmount = subtotal;
  let appliedCouponId = null;

  if (couponCode) {
    // Calling the function we created earlier
    // Note: Pass 'client' if your function needs to use the current transaction
    const couponCalc = await calculateTotalWithDiscount(subtotal, couponCode, client);
    
    if (!couponCalc.success) {
      throw new Error(couponCalc.error); // Stop order if coupon is invalid/expired
    }

    finalAmount = couponCalc.totalWithDiscount;
    appliedCouponId = couponCalc.couponId;
  }

  // 4. Insert main order (Using finalAmount after discount)
  const orderResult = await client.query(
    `INSERT INTO orders (user_id, status, total_amount, currency, payment_provider, billing_details, coupon_id)
     VALUES ($1, $2, $3, 'EGP', $4, $5, $6) RETURNING id`,
    [userId, statu, finalAmount, payment_provider, JSON.stringify(billingData), appliedCouponId]
  );

  const orderId = orderResult.rows[0].id;

  // 5. Insert order items & Update Stock
  for (const pItem of processedItems) {
    await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, product_title, product_description)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, pItem.id, pItem.quantity, pItem.price, pItem.title, pItem.description]
    );

    await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [pItem.quantity, pItem.id]);
  }

  // 6. If coupon was used, increment the usage count
  if (appliedCouponId) {
    await client.query(
      `UPDATE coupons SET used_count = used_count + 1 WHERE id = $1`,
      [appliedCouponId]
    );
  }

  return { orderId, totalAmount: finalAmount };
};



exports.checkout = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, billingData ,couponCode } = req.body;
    let userId = req.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }
    
    await client.query("BEGIN");
     
    if (!userId) {
    userId = await getOrCreateUser(client ,userId ,billingData)
    }
   

    ///  
    
   await addBillingDataToUser(client ,userId ,billingData)
   const OrderAndItems = await processOrderAndItems(client ,userId,items,"pending", "Card" ,billingData ,couponCode)

    const token = await paymobService.getAuthToken();
    const amountInCents = Math.round(OrderAndItems.totalAmount * 100);
    const paymobOrder = await paymobService.createOrder(token, {
      amount: amountInCents,
      billingData: billingData,
    });

    await client.query(`UPDATE orders SET provider_order_id = $1 WHERE id = $2`, [paymobOrder.id, OrderAndItems.orderId]);
    const paymentKey = await paymobService.generatePaymentKey(token, paymobOrder.id, amountInCents, billingData, integrationIdCard);

    await client.query("COMMIT");
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    res.json({ iframeUrl });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message || "Checkout failed" });
  } finally {
    client.release();
  }
};

// 2. Wallet Checkout
exports.checkoutWallet = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, billingData, walletNumber ,couponCode } = req.body;
    let userId = req.userId;

    if (!walletNumber) return res.status(400).json({ error: "Wallet number is required" });
    if (!items || items.length === 0) return res.status(400).json({ error: "No items provided" });

    await client.query("BEGIN");

    if (!userId) {
    userId = await getOrCreateUser(client ,userId ,billingData)
    }

     await addBillingDataToUser(client ,userId ,billingData)
     const OrderAndItems = await processOrderAndItems(client ,userId,items,"pending" ,"Wallet" ,billingData ,couponCode)

    const token = await paymobService.getAuthToken();
    const amountInCents = Math.round(OrderAndItems.totalAmount * 100);
    const paymobOrder = await paymobService.createOrder(token, { amount: amountInCents, billingData });
    const paymentKey = await paymobService.generatePaymentKey(token, paymobOrder.id, amountInCents, billingData, integrationIdWallet);

    const response = await axios.post("https://accept.paymob.com/api/acceptance/payments/pay", {
      source: { identifier: walletNumber, subtype: "WALLET" },
      payment_token: paymentKey
    });
      
    const redirectUrl = response.data.redirect_url || response.data.iframe_redirection_url;

    if (!redirectUrl) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Failed to get redirect URL from Paymob" });
    }

    await client.query(`UPDATE orders SET provider_order_id = $1 WHERE id = $2`, [paymobOrder.id, OrderAndItems.orderId]);
    await client.query("COMMIT");
    res.json({ redirectUrl });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};



exports.checkoutCash = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, billingData , couponCode} = req.body;
    let userId = req.userId;

    if (!items || items.length === 0) return res.status(400).json({ error: "No items provided" });

    await client.query("BEGIN");

    if (!userId) {
    userId = await getOrCreateUser(client ,userId ,billingData)
    }

    await addBillingDataToUser(client ,userId ,billingData)
    const OrderAndItems = await processOrderAndItems(client ,userId,items,"processing", "cash on delivary" ,billingData ,couponCode)
    
    

     
    await client.query("COMMIT");

    const htmlTemp = orderConfirmationEmail({name : billingData.first_name , orderId :OrderAndItems.orderId ,total : OrderAndItems.totalAmount})
    const sendemail = sendMailNodemailer({ to:billingData.email , subject: htmlTemp.subject , text :htmlTemp.text ,html : htmlTemp.html})

    res.status(201).json({ success: true, orderId: OrderAndItems.orderId, redirectUrl: `/checkout/order-success?success=true&id=${OrderAndItems.orderId}` });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};



exports.checkCoupons = async (req, res) => {
  try {
    const { itemscheckout, couponCode } = req.body;
      


    if (!itemscheckout || !Array.isArray(itemscheckout) || itemscheckout.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid." });
    }

    let originalTotal = 0;
    
    for (const item of itemscheckout) {
      // Example DB query to get the real price:

      const productResult = await pool.query('SELECT discount_price FROM products WHERE id = $1', [item.id]);
      if (productResult.rows.length === 0) return res.status(404).json({ error: `Product ${item.id} not found.` });
      const realPrice = productResult.rows[0].discount_price;
            
      // Ensure quantity is a valid positive number
    const quantity = Math.max(1, parseInt(item.quantity) || 1);
      originalTotal += (realPrice * quantity);
    }

    let discountAmount = 0;
    let finalTotal = originalTotal;

    if (couponCode) {
      // Fetch the coupon from the database
      const couponQuery = `
        SELECT * FROM coupons 
        WHERE code = $1
      `;
      const couponResult = await pool.query(couponQuery, [couponCode]);
      const coupon = couponResult.rows[0];

      if (!coupon) {
        return res.status(404).json({ error: "Invalid coupon code." });
      }

      // Validation Step 2: Check if coupon is active
      if (!coupon.is_active) {
        return res.status(400).json({ error: "This coupon is currently inactive." });
      }

      // Validation Step 3: Check expiry date
      const currentDate = new Date();

      if (new Date(coupon.expiry_date) < currentDate) {
        return res.status(400).json({ error: "This coupon has expired." });
      }

      // Validation Step 4: Check usage limit
      if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
        return res.status(400).json({ error: "This coupon has reached its maximum usage limit." });
      }
 
      // Validation Step 5: Check minimum order value
      if (originalTotal < parseFloat(coupon.min_order_value)) {
        return res.status(400).json({ 
          error: `Minimum order value of ${coupon.min_order_value} is required to use this coupon.` 
        });
      }

      // 4. Calculate the discount amount
      const discountValue = parseFloat(coupon.discount_value);

      if (coupon.discount_type === 'percentage') {
        discountAmount = originalTotal * (discountValue / 100);
        
        // Validation Step 6: Apply the maximum discount cap if it exists
        if (coupon.max_discount_amount !== null) {
          const maxDiscount = parseFloat(coupon.max_discount_amount);
          if (discountAmount > maxDiscount) {
            discountAmount = maxDiscount;
          }
        }
      } else if (coupon.discount_type === 'fixed') {
        discountAmount = discountValue;
      }

      // Validation Step 7: Ensure the discount is never greater than the total order amount
      if (discountAmount > originalTotal) {
        discountAmount = originalTotal;
      }

      // Calculate the final price after discount
      finalTotal = originalTotal - discountAmount;
    }

    // 5. Return the successful calculation
    return res.status(200).json({
      success: true,
      originalTotal: Number(originalTotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
      message: couponCode ? "Coupon applied successfully." : "Checkout total calculated successfully."
    });

  } catch (error) {
    console.error("Error during checkout calculation:", error);
    return res.status(500).json({ error: "An unexpected error occurred during calculation." });
  }
};


