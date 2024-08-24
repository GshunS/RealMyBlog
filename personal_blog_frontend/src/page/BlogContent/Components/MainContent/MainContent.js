import './MainContent.css'
import { useSelector } from 'react-redux'

const MainContent = () => {

    const {
        canRender
    } = useSelector(state => state.blogContentNavbar)

    if(canRender){
        return (
            <div className="main-content">main</div>
        )
    }else{
        return
    }
    
}

export default MainContent