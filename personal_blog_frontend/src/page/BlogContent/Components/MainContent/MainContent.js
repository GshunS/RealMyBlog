import './MainContent.css'
import { useSelector } from 'react-redux'
import { ReactComponent as Author } from '../../../../assets/images/author.svg'
import { ReactComponent as View } from '../../../../assets/images/view_count.svg'
import { ReactComponent as Upvote } from '../../../../assets/images/upvote.svg'

import TiptapTextArea from './TipTapTextArea'
import { useEffect, useState } from 'react'

const MainContent = () => {

    const {
        canRender
    } = useSelector(state => state.blogContentNavbar)

    const {
        showTextArea,
        articleInfo,
        articleSaveStatus
    } = useSelector(state => state.blogContentMainContent)

    const [saveMsg, setSaveMsg] = useState('');
    const [dotCount, setDotCount] = useState(0);
    useEffect(() => {
        if (articleSaveStatus !== 'unsave') {
            if (articleSaveStatus === 'saving') {
                setSaveMsg('saving')
                const intervalId = setInterval(() => {
                    setDotCount(prevDotCount => (prevDotCount % 3) + 1);
                }, 1000);
                return () => clearInterval(intervalId);
            }
            else {
                setSaveMsg('saved')
            }
        }
        setDotCount(0);
    }, [articleSaveStatus])

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
                    <div className="main-content__footer">
                            <div className="main-content__footer-left">
                                <span className={`main-content__status main-content__status--${articleSaveStatus}`}>
                                    {saveMsg}
                                    <span className="dots">{'.'.repeat(dotCount)}</span>
                                </span>
                            </div>
                            <div className="main-content__footer-right">
                                {/* <span className="main-content__wordCount">Words: {200}</span>
                                <span className="main-content__cursorPosition">Line: {14}, Col: {56}</span> */}
                                <span className="main-content__createdAt">Created: {articleInfo.articleCreatedTime}</span>
                                <span className="main-content__updatedAt">Updated: {articleInfo.articleUpdatedTime}</span>
                            </div>
                        </div>
                </>
            ) : null}
        </div>
    );

}

export default MainContent