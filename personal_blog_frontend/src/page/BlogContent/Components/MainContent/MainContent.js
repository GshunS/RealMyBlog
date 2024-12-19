import './MainContent.css'
import { useSelector } from 'react-redux'
import { ReactComponent as Author } from '../../../../assets/images/author.svg'
import { ReactComponent as View } from '../../../../assets/images/view_count.svg'
import { ReactComponent as Upvote } from '../../../../assets/images/upvote.svg'
import { ReactComponent as Pencil } from '../../../../assets/images/pencil.svg';

import TiptapTextArea from './TipTapTextArea'
import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateAttrs } from '../../../../store/modules/blogContentMainContentStore'
import { editAllCategories } from '../../../../store/modules/blogContentNavBarStore'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { produce } from 'immer'
const MainContent = () => {
    const dispatch = useDispatch();
    const {
        canRender,
        allCategories,
        currentAncestorNames
    } = useSelector(state => state.blogContentNavbar)

    const {
        showTextArea,
        articleInfo,
        articleSaveStatus
    } = useSelector(state => state.blogContentMainContent)

    const { tokenValid } = useSelector(state => state.blogContentLogin);



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




    //#region title update

    const [readOnly, setReadOnly] = useState(!tokenValid);

    const [title, setTitle] = useState("");
    const [oldTitle, setOldTitle] = useState("")
    const inputRef = useRef(null);

    useEffect(() => {
        if (articleInfo.articleId !== null) {
            setTitle(articleInfo.articleTitle)
            setOldTitle(articleInfo.articleTitle)
        }
    }, [articleInfo])


    const handleTitleClick = () => {
        if (tokenValid) {
            setReadOnly(false);
        }
    };

    const handleInputBlur = () => {
        if (!readOnly) {
            setReadOnly(true);
            submitTitleUpdate();
        }
    };

    const handleInputChange = (e) => {
        if (tokenValid) {
            setTitle(e.target.value);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current.blur();
        }
    };

    const submitTitleUpdate = async () => {
        const cleanTitle = title.trim();
        if (oldTitle === cleanTitle) return;
        if (cleanTitle === '') {
            dispatch(editErrorMsg({ type: 'WARNING', msg: 'invalid title' }))
            setTitle(oldTitle);
            return;
        }
        const patchData = [
            {
                "operationType": 2,
                "path": "/title",
                "op": "replace",
                "from": "",
                "value": cleanTitle
            }
        ]
        const res = await dispatch(updateAttrs(patchData))
        if (res) {
            setOldTitle(cleanTitle)
            let tempAllCategories = produce(allCategories, draft => {
                let current = draft;
                currentAncestorNames.forEach((ele, index) => {
                    if (index === currentAncestorNames.length - 1) {
                        current[ele]['articles'][articleInfo.articleId] = title.trim()
                    } else {
                        current = current[ele]['subCategories']
                    }

                })
            })
            dispatch(editAllCategories(tempAllCategories))
        }
    };
    //#endregion

    const jumpToLogin = () => {
        if (tokenValid) return;
        dispatch(editErrorMsg({ type: 'WARNING', msg: 'Please login to edit' }));

        const loginIconNode = document.getElementsByClassName('header__login')[0];

        loginIconNode.classList.add('hover');
        const timeoutId = setTimeout(() => {
            loginIconNode?.classList.remove('hover');
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            loginIconNode?.classList.remove('hover');
        };
    };


    if (!canRender) return <div></div>;

    return (
        <div className="main-content">
            {showTextArea ? (
                <>
                    <div className="main-content__info">
                        <form>
                            <div className="main-content__title" onClick={handleTitleClick}>
                                <input
                                    ref={inputRef}
                                    value={title}
                                    onBlur={handleInputBlur}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    readOnly={readOnly}
                                />
                                <div
                                    className={`main-content__editability-icon ${!tokenValid ? 'read-only' : ''}`}
                                    title={!tokenValid ? 'Please login to edit' : ''}
                                    onClick={jumpToLogin}
                                >
                                    <Pencil />
                                </div>
                            </div>
                        </form>
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