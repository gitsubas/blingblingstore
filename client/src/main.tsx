import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { OrdersProvider } from './context/OrdersContext'
import { ProductsProvider } from './context/ProductsContext'
import { WishlistProvider } from './context/WishlistContext'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ProductsProvider>
                    <CartProvider>
                        <OrdersProvider>
                            <WishlistProvider>
                                <RecentlyViewedProvider>
                                    <App />
                                </RecentlyViewedProvider>
                            </WishlistProvider>
                        </OrdersProvider>
                    </CartProvider>
                </ProductsProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
