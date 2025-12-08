import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('BlingBling Store API is running');
});

import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/product/product.routes';

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
