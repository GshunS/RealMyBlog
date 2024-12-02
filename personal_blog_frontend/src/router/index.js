import Blog from '../page/BlogContent'
import LivePage from '../page/LivePage'
import NotFound from '../page/NotFound'
import Home from '../page/Home'
import {createBrowserRouter, Navigate} from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/live',
        element: <LivePage/>
    },
    {
        path: '/blog',
        element: <Blog/>
    },
    {
        path: '*',
        element: <NotFound/>
    }
])

export default router