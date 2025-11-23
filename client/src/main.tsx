import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { OrdersProvider } from './context/OrdersContext.tsx'
import { ProductsProvider } from './context/ProductsContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ProductsProvider>
                    <OrdersProvider>
                        <CartProvider>
                            <App />
                        </CartProvider>
                    </OrdersProvider>
                </ProductsProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
