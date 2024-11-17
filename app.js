require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const donateRoutes = require('./routes/donateRoutes');
const contactRoutes = require('./routes/contact_messagesRoutes');
const sequelize = require('./config/database');
const categoryRoutes = require('./routes/categoryRouters');
const cloudinary = require('cloudinary');
const paypalService = require('./services/paypal');
const Donate = require('./models/donate');
const https = require('https');
const fs = require('fs');
const app = express();
const i18n = require('i18n');
const hostname = '0.0.0.0';
const port = 3000;
cloudinary.v2.config({
  cloud_name: 'dj0ipxidd',
  api_key: '568391281379526',
  api_secret: 'Q8Aj2evbXb_FY1uUs0XVFPXX5zA',
  secure: true,
});

i18n.configure({
  locales: ['en', 'vi'], // Danh sách các ngôn ngữ hỗ trợ
  directory: path.join(__dirname, 'locales'), // Thư mục chứa các tệp ngôn ngữ
  defaultLocale: 'en', // Ngôn ngữ mặc định
  cookie: 'lang', // Tên cookie để lưu trữ ngôn ngữ người dùng
});

app.use(i18n.init);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', postRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/category', categoryRoutes);
app.use('/donate', donateRoutes);
app.use('/contact', contactRoutes);
app.post('/pay', async(req, res) => {
  try {
      const url = await paypal.createOrder()

      res.redirect(url)
  } catch (error) {
      res.send('Error: ' + error)
  }
}) 
app.post('/create-order', async(req, res) => {
  try {
      console.log(req.body); // Kiểm tra xem req.body có gì
      const price = req.body.price;
      const orderUrl = await paypalService.createOrder(price);
      res.json({ url: orderUrl });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
})
app.get('/complete-order', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
      const accessToken = await paypalService.getAccessToken();
      const orderId = req.query.orderId;
      const name = req.query.name; // Lấy tên từ query string

      // Kiểm tra trạng thái đơn hàng trước khi capture
      const orderDetails = await paypalService.getOrderDetails(orderId, accessToken);
      if (orderDetails.status === 'COMPLETED') {
          return res.render('donation/complete-order', { message: 'Đơn hàng đã hoàn tất.', name });
      }

      const captureDetails = await paypalService.capturePayment(orderId, accessToken);


  } catch (error) {
      if (error.name === 'UNPROCESSABLE_ENTITY' && error.details[0].issue === 'ORDER_ALREADY_CAPTURED') {
          return res.render('donation/complete-order', { message: 'Đơn hàng đã được capture trước đó.', name });
      }
      res.send('Lỗi: ' + error.message);
  }
});

app.post('/save-donation', async (req, res) => {
  try {
    const { firstName, lastName, email, amount } = req.body;

    // Lưu thông tin vào cơ sở dữ liệu
    await Donate.create({
      name: `${firstName} ${lastName}`,
      email: email,
      amount: parseFloat(amount)
    });

    // Gửi email thông báo
    await paypalService.sendEmailNotification(null, {
      payer: { email_address: email, name: `${firstName} ${lastName}` },
      amount
    });

    res.status(200).send('Donation saved and email sent successfully');
  } catch (error) {
    console.error('Error saving donation or sending email:', error.message);
    res.status(500).send('Error saving donation or sending email');
  }
});
app.get('/cancel-order', (req, res) => {
  res.redirect('/')
})
app.get('/the-issues', (req, res) => {
  res.render('theissues');
})
app.get('/contact', (req, res) => {
  res.render('contact');
})
app.get('/we-will-do', (req, res) => {
  res.render('wewilldo');
})
app.get('/we-will-do/fighting-hunger', (req, res) => {
  res.render('ourwork/fightinghunger');
})
app.get('/we-will-do/preventing-disease', (req, res) => {
  res.render('ourwork/preventingdisease');
})
app.get('/we-will-do/ensuring-clean-water', (req, res) => {
  res.render('ourwork/ensuring-clean-water');
})
app.get('/about', (req, res) => {
  res.render('about');
})
// Sync database and start server
sequelize.sync().then(() => {
  const options = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt')
  };
  https.createServer(options, app).listen(port, hostname, () => {
    console.log(`Server running on port ${port}`);
  });
});
