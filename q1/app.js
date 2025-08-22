const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Create uploads directory
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Multer configuration
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files allowed'));
        }
    }
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Validation rules
const validationRules = [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    body('email').isEmail().withMessage('Invalid email format'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('hobbies').isArray({ min: 1 }).withMessage('Select at least one hobby')
];

// Routes
app.get('/', (req, res) => {
    res.render('register', { errors: [], formData: {} });
});

app.post('/register', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'otherPics', maxCount: 5 }
]), validationRules, (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.render('register', { 
            errors: errors.array(), 
            formData: req.body 
        });
    }

    const userData = {
        ...req.body,
        profilePic: req.files.profilePic ? req.files.profilePic[0] : null,
        otherPics: req.files.otherPics || []
    };

    res.render('success', { userData });
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    
    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).send('File not found');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});