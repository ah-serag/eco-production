const axios = require("axios");
const config = require("../../config/paymob.config");

const BASE_URL = "https://accept.paymob.com/api";

async function getAuthToken() {
  const { data } = await axios.post(`${BASE_URL}/auth/tokens`, {
    api_key: config.apiKey,
  });

  return data.token;
}

async function createOrder(token, orderData) {
  const { data } = await axios.post(`${BASE_URL}/ecommerce/orders`, {
    auth_token: token,
    delivery_needed: false,
    amount_cents: orderData.amount,
    currency: "EGP",
    items: [],
  });

  return data;
}

async function generatePaymentKey(token, orderId, amount , billingData) {
  const { data } = await axios.post(`${BASE_URL}/acceptance/payment_keys`, {
    auth_token: token,
    amount_cents: Math.round(amount),
    expiration: 3600,
    order_id: orderId,
      billing_data: {

        first_name: billingData.first_name,

        last_name: billingData.last_name,

        email: billingData.email,

        phone_number: billingData.phone_number,

        street: billingData.street,

        building: billingData.building,

        floor: "NA",

        apartment: "NA",

        city: billingData.city,

        state: billingData.state,

        country: "EG",

        postal_code: "00000",

        extra_description: "",

        shipping_method: "PKG",

      },
    currency: "EGP",
    integration_id: config.integrationId,
  });

  return data.token;
}

module.exports = {
  getAuthToken,
  createOrder,
  generatePaymentKey,
};