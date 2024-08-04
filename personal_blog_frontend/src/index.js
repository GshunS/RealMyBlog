import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import store from './store/index'
import { RouterProvider } from 'react-router-dom'
import router from './router'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}></RouterProvider>
        </Provider>
    // </StrictMode>
);


