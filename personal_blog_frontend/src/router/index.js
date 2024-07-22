import Blog from '../page/BlogContent'
import TestPage from '../page/TestPage'
import NotFound from '../page/NotFound'
import {createBrowserRouter} from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/test',
        element: <TestPage/>
    },
    {
        path: '/',
        element: <Blog/>
    },
    {
        path: '*',
        element: <NotFound/>
    }
])


export default router