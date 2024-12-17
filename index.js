const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const morgan = require('morgan');

const app = express();
const secretKey = "mySecretKey"; // Simpan di environment variable

// Middleware
app.use(cors()); // Allow all origins (change this in production)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // Logging requests

// Routes
app.post('/player/login/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/dashboard.html'));
});

app.post('/player/growid/login/validate', (req, res) => {
    const { _token, growId, password } = req.body;

    if (!_token || !growId || !password) {
        return res.status(400).send({ status: "error", message: "Invalid Input" });
    }

    const token = jwt.sign({ growId, _token }, secretKey, { expiresIn: '1h' });

    res.json({
        status: "success",
        message: "Account Validated.",
        token,
        accountType: "growtopia"
    });
});

app.post('/player/growid/checktoken', (req, res) => {
    const token = req.body.refreshToken;
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, secretKey);
        res.json({ status: "success", message: "Token is valid", data: decoded });
    } catch (err) {
        res.status(401).send("Invalid token");
    }
});

app.post('/player/validate/close', (req, res) => {
    res.send('<script>window.close();</script>');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
