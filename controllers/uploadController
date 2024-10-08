const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/product');

const uploadDir = path.join(__dirname, '../views/images/uploaded/');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Only image files are allowed (JPEG, PNG, WEBP).'), false); 
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter 
});


exports.upload_image = [
    upload.single('image'),
    (req, res) => {
        if (!req.file) {
            return res.status(400).send('No image file uploaded.');
        }

        const imageUrl = `/images/uploaded/${req.file.filename}`; 
        res.json({ imageUrl });
    }
];

exports.delete_unused_files = async () => {
    try {
        const products = await Product.find({}, 'imageUrl');
        const productImages = products.map(product => path.basename(product.imageUrl)); 

        const allFiles = fs.readdirSync(uploadDir);
        const unusedFiles = allFiles.filter(file => !productImages.includes(file));

        unusedFiles.forEach(file => {
            const filePath = path.join(uploadDir, file);
            fs.unlinkSync(filePath); 
        });

        console.log(`Deleted ${unusedFiles.length} unused files.`);
    } catch (error) {
        console.error('Error deleting unused files:', error);
    }
};
