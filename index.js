import express from 'express';
import cors from 'cors';
import routes from './Routers/User/routes.js';
import routesCategory from './Routers/Category/routesCategory.js';
import routesProduct from './Routers/Product/routesProduct.js';
import routesRestaurantConfig from './Routers/RestaurantConfig/routesRestaurantConfig.js';
import routesPedido from './Routers/Pedido/routesPedido.js';
import routesPayment from './Routers/Payment/routesPayment.js';
import 'dotenv/config';

const app = new express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_PUBLIC_URL,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
};

const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use('/api/pagamentos', routesPayment);
app.use(express.static('public'));
app.use('/api/users', routes);
app.use('/api/categorias', routesCategory);
app.use('/api/produtos', routesProduct);
app.use('/api/configuracao', routesRestaurantConfig);
app.use('/api/pedidos', routesPedido);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
