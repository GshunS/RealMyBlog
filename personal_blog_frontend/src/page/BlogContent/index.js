import Header from "./Components/Header/Header"
import NavBar from './Components/NavBar/NavBar'
import MainContent from './Components/MainContent/MainContent'
import ErrorPopUp from "./Components/ErrorPopUp/ErrorPopUp"
import FolderFileCreationWindow from "./Components/FolderFileCreationWindow/FolderFileCreationWindow"
import ParticleBackground from './Components/ParticleBackground/ParticleBackground';
import '../styles/reset.css'
import './index.css'

const BlogContent = () => {

    return (
        <div className="blog-container">
            <ParticleBackground/>
            <FolderFileCreationWindow />
            <ErrorPopUp />
            <Header />
            <div className="body-container">
                <NavBar />
                <MainContent />
            </div>

        </div>
    )
}

export default BlogContent