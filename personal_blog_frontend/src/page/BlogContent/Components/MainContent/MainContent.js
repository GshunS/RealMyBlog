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

    const {
        showTextArea,
        articleInfo
    } = useSelector(state => state.blogContentMainContent)


    if (!canRender) return <div></div>;

    return (
        <div className="main-content">
            {showTextArea ? (
                <>
                    <div className="main-content__info">
                        <div className="main-content__title">
                            <span>{articleInfo.articleTitle}</span>
                        </div>
                        <div className="main-content__otherInfo">
                            <div className="main-content__path">{articleInfo.articlePath}</div>
                            <div className="main-content__stats">
                                <div className="main-content__author">
                                    <Author /> {articleInfo.authorName}
                                </div>
                                <div className="main-content__view">
                                    <View /> {articleInfo.articleViewAmount}
                                </div>
                                <div className="main-content__upvote">
                                    <Upvote /> {articleInfo.articleUpvoteAmount}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main-content__textBody">
                        <div className="main-content__textContent">
                            <TiptapTextArea />
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );

}

export default MainContent