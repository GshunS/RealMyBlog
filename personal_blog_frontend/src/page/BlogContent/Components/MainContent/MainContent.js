import './MainContent.css'
import { useSelector } from 'react-redux'
import { ReactComponent as Author } from '../../../../assets/images/author.svg'
import { ReactComponent as View } from '../../../../assets/images/view_count.svg'
import { ReactComponent as Upvote } from '../../../../assets/images/upvote.svg'

import TiptapTextArea from './TipTapTextArea'

const MainContent = () => {

    const {
        canRender
    } = useSelector(state => state.blogContentNavbar)


    if (canRender) {
        return (
            <div className="main-content">
                <div className="main-content__info">
                    <div className="main_content__title">
                        <span>this is a title</span>
                    </div>
                    <div className="main_content__otherInfo">
                        <div className="main_content__path">
                            /MySQL/What is my SQL
                        </div>
                        <div className="main_content__stats">
                            <div className="main_content__author">
                                <Author/> aasdas
                            </div>
                            <div className="main_content__view">
                                <View/> 0
                            </div>
                            <div className="main_content__upvote">
                                <Upvote/> 02312
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main-content__textBody">
                    <div className="main-content__textContent">
                        <TiptapTextArea/>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }

}

export default MainContent