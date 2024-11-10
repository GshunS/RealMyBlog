import '../styles/reset.css'
import './index.css'
import Header from "./Components/Header/Header"
import NavBar from './Components/NavBar/NavBar'
import MainContent from './Components/MainContent/MainContent'
import Resizer from "./Components/Resizer/Resizer"
import ErrorPopUp from "./Components/ErrorPopUp/ErrorPopUp"
import FolderFileCreationWindow from "./Components/FolderFileCreationWindow/FolderFileCreationWindow"
import ParticleBackground from './Components/ParticleBackground/ParticleBackground';
import FormDialog from './Components/Dialog/FormDialog'

const BlogContent = () => {

    return (
        <div className="blog-container">
            <ParticleBackground />
            <FormDialog />
            <FolderFileCreationWindow />
            <ErrorPopUp />
            <Header />
            <div className="body-container">
                <NavBar />
                <Resizer />
                <MainContent />
            </div>

        </div >
    )
}

export default BlogContent