import { useState, useRef, useEffect } from 'react';

import classNames from 'classnames';
import downarrow from '../../../../assets/images/caret-down-solid.svg'
import avatar from '../../../../assets/images/gz.jpg'
import './Header.css';
import { editStatus } from '../../../../store/modules/mainHeaderStore';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// header js
const Header = () => {
    // editable is a state that is used to control the dropdown menu
    const { editable } = useSelector(state => state.mainHeader);

    // dropDownValue is a state {view or edit} that is used to control the dropdown menu
    const [dropDownValue, setDropDownValue] = useState('View');

    // inputValue is a state that is used to store the input value
    const [inputValue, setInputValue] = useState('');

    // displayArticles is a state that is used to store the articles that are found
    const [displayArticles, setDisplayArticles] = useState([]);

    // hasData is a state that is used to control the display of the articles
    const [hasData, setHasData] = useState(false);

    const [typingTimeout, setTypingTimeout] = useState(null);

    const dispatch = useDispatch();

    // buttonRef is a reference to the button element (view/edit)
    const buttonRef = useRef(null);

    // hideRef is a reference to the dropdown element
    const hideRef = useRef(null);

    const listRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {

        if (hasData) {
            let allText = []
            let wordsToHighlight = inputValue.split(' ');
            Array.from(listRef.current.children).forEach(child => {
                allText.push(child.children[0].textContent)
            });
            
            wordsToHighlight.forEach(word => {
                for (let i = 0; i < allText.length; i++) {
                    const regex = new RegExp(`\\b${word.trim()}\\b`, 'gi');
                    allText[i] = allText[i].replace(regex, match => `<span class="header__highlight">${match}</span>`);
                }
            })

            Array.from(listRef.current.children).forEach(child => {
                child.children[0].innerHTML = allText.shift()
            });
        }

    }, [hasData, inputValue])



    const viewExp = () => {
        dispatch(editStatus())
        if (!editable)
            buttonRef.current.style.backgroundColor = '#E8E8E8';
        else
            buttonRef.current.style.backgroundColor = 'white';
    }

    function selectDropdown() {
        dispatch(editStatus())
        setDropDownValue('Edit' === dropDownValue ? 'View' : 'Edit');
        buttonRef.current.style.backgroundColor = 'white';
    }

    const onInput = async (e) => {
        var term = e.target.value
        if (term.trim() === '') {
            setDisplayArticles([])
            return
        }
        setInputValue(term.trim())
        // if (inputValue === term.trim()) return
        // setInputValue(term)
    }

    // detect when user stops typing
    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const timer = setTimeout(async () => {
            if (inputValue) {
                // console.log('User has stopped typing:', inputValue);
                await getArticles(inputValue);
            }
        }, 500);

        setTypingTimeout(timer);

        return () => {
            clearTimeout(timer);
        };
    }, [inputValue]);

    // getArticles is a function that is used to get the articles by full text search from the backend
    const getArticles = async (term) => {
        if (displayArticles.length > 0) {
            setDisplayArticles([])
            setHasData(false)
        }
        var url = `https://localhost:7219/api/articles/${term}`;
        try {
            const response = await axios.get(url);
            if (response.data.length === 0) {
                setDisplayArticles([`No articles found for ${term}`])
            } else {
                var articleArray = []
                response.data.forEach((article) => {
                    articleArray.push(
                        { id: article.id, content: article.part_content }
                    )
                })

                setDisplayArticles(articleArray)
                setHasData(true)
                setInputValue(term)
                // console.log(articleArray)
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    setDisplayArticles([`Bad Request: ${error.response.data}`])
                } else if (status === 500) {
                    setDisplayArticles([`Internal Server Error: ${error.response.data}`])
                } else {
                    setDisplayArticles([`Error: ${error.response.data}`])
                }
            } else if (error.request) {
                setDisplayArticles([`No response received: ${error.request}`])
            } else {
                setDisplayArticles([`No response received: ${error.message}`])
            }
        }
    }

    const onClickArticle = (id) => {
        console.log(`Article ID: ${id}`)
        inputRef.current.value = ''
        onInput({ target: { value: '' } })
    }


    return (
        // header html
        <div className="header">
            {/* avater */}
            <div className="header__avatar">
                <img src={avatar} alt='avatar' />
            </div>
            {/* search bar */}
            <div className="header__search_bar">
                <input
                    type="text"
                    className="header__search"
                    placeholder="Type to search"
                    onChange={(e) => onInput(e)}
                    ref={inputRef}
                />
                {/* display articles */}

                <ul className="header__display" ref={listRef}>
                    {hasData ? (
                        displayArticles.map(item => (
                            <li
                                key={item.id}
                                className={classNames('header__display_item')}
                                onClick={(e) => onClickArticle(item.id)}
                            >
                                <span>...&nbsp;{item.content}&nbsp;...</span></li>
                        ))
                    ) : <li key={-1}><span>{displayArticles}</span></li>}
                </ul>
            </div>

            {/* header attributes - right side*/}
            <div className="header__attrs">
                {/* view or edit button*/}
                <div className="header__view">
                    <div className="header__view_button" onClick={() => viewExp()} ref={buttonRef}>
                        <span>{dropDownValue}</span>
                        <img
                            className={classNames('header__view_arrow', { arrow_expand: editable })}
                            src={downarrow}
                            alt="dropdown"
                        />
                    </div>
                    {/* dropdown meue*/}
                    <div
                        className={classNames("header__view_dropdown", { dropdown_expand: editable })}
                        onClick={() => selectDropdown()}
                        ref={hideRef}>
                        <span>{'Edit' === dropDownValue ? 'View' : 'Edit'}</span>
                        <img
                            className={classNames('header__view_arrow')}
                            src={downarrow}
                            alt="dropdown"
                            style={{ opacity: 0 }}
                        />
                    </div>

                </div>
                {/* Theme */}
                <div className="header__attr">Theme</div>

                {/* Login */}
                <div className="header__attr">Login</div>
            </div>
        </div>
    );
}

export default Header;