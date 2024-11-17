require('dotenv').config();
const axios = require('axios');
const nodemailer = require('nodemailer');

const paypalService = {
  async getAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await axios.post('https://api-m.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`
        }
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Lỗi khi lấy access token:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  async capturePayment(orderId) {
    const accessToken = await this.getAccessToken();
    try {
      const response = await axios.post(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      await sendEmailNotification(orderId, response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi capture thanh toán:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  async getOrderDetails(orderId) {
    const accessToken = await this.getAccessToken();
    try {
      const response = await axios.get(`https://api-m.paypal.com/v2/checkout/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

async function sendEmail(email, subject, text, html) {
    if (!email) {
      throw new Error('Email recipient is required');
    }
  
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tntheanh2004.dev@gmail.com',
        pass: 'xgdv doqe bywg tlzp'
      }
    });
  
    let mailOptions = {
      from: 'tntheanh2004.dev@gmail.com',
      to: email,
      subject: subject,
      text: text,
      html: html
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', email);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

async function sendEmailNotification(orderId, orderData) {
    const email = orderData.payer.email_address;
    const name = orderData.payer.name;
    const amount = orderData.amount;
    const subject = ' Nice to meet you! ';
    const text = `Thank you, ${name}, for your generous donation of $${amount}. We sincerely appreciate your support.`;
    const html = `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1>Dear ${name}</h2>
                    <p style="font-size: 16px;">Thank you for donating <strong style="color: #ff0000;">$${amount}</strong> <br>We would like to express our sincere and heartfelt thanks for your valuable concern and support towards those in need. Your generosity not only brings hope but also serves as a great encouragement to help those facing hardships overcome challenges in life. <br><br>

Your compassionate heart and willingness to share have contributed to making this world a better place. Even though your small actions may not be widely known, they hold immense meaning for those who need help the most. <br><br>

Once again, we sincerely thank you and hope that you will continue to accompany us in these meaningful activities. <br><br>

Wishing you good health, happiness, and success. <br><br>

Sincerely, <span style="font-weight: bold; color: #ff0000;">Leaf Aid</span> </p>
                    <p><img src="https://res.cloudinary.com/dj0ipxidd/image/upload/v1731534218/o46vudrconng0kk53n0n.jpg" alt="Logo" style="width: 500px; height: auto;"></p>
                  </div>`;
  
    try {
      await sendEmail(email, subject, text, html);
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
    }
}

module.exports = {
  ...paypalService,
  sendEmailNotification
};