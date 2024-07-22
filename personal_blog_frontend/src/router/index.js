import Main from '../page/Main'
import TestPage from '../page/TestPage'

import {createBrowserRouter} from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/test',
        element: <TestPage/>
    },
    {
        path: '/',
        element: <Main/>
    }
])


export default router