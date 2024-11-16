import '../styles/reset.css'
import './index.css'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { JwtValidation, editTokenValid } from '../../store/modules/blogContentLoginStore'
import Header from "./Components/Header/Header"
import NavBar from './Components/NavBar/NavBar'
import MainContent from './Components/MainContent/MainContent'
import Resizer from "./Components/Resizer/Resizer"
import ErrorPopUp from "./Components/ErrorPopUp/ErrorPopUp"
import FolderFileCreationWindow from "./Components/FolderFileCreationWindow/FolderFileCreationWindow"
import ParticleBackground from './Components/ParticleBackground/ParticleBackground';
import FormDialog from './Components/Dialog/FormDialog'
import AlertDialog from './Components/Dialog/AlertDialog'
import ErrorFallback from './Components/ErrorFallBack/ErrorFallBack';
import { ErrorBoundary } from 'react-error-boundary';
const BlogContent = () => {
    const { token } = useSelector(state => state.blogContentLogin);
    const dispatch = useDispatch()

    useEffect(() => {
        if (token) {
            dispatch(JwtValidation())
        } else {
            dispatch(editTokenValid(false))
        }
    }, [token, dispatch])




    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                window.location.reload();
            }}
        >
            <div className="blog-container">
                <ParticleBackground />
                <FormDialog />
                <AlertDialog />
                <FolderFileCreationWindow />
                <ErrorPopUp />
                <Header />
                <div className="body-container">
                    <NavBar />
                    <Resizer />
                    <MainContent />
                </div>

            </div >
        </ErrorBoundary>

    )
}

export default BlogContent