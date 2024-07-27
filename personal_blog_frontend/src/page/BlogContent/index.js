import Header from "./Components/Header/Header"
import NavBar from './Components/NavBar/NavBar'
import MainContent from './Components/MainContent/MainContent'
import '../styles/reset.css'
import './index.css'

const BlogContent = () => {
    return (
        <div className="blog-container">
            <Header />
            <div className="body-container">
                <NavBar />
                <MainContent />
            </div>
        </div>
    )
}

export default BlogContent