import { useState, useRef, useEffect, useCallback } from 'react';
import { fetchData } from '../../../../utils/apiService'
import classNames from 'classnames';
import avatar from '../../../../assets/images/gz.jpg'
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { getArticleInfo } from '../../../../store/modules/blogContentMainContentStore'
import { editAlertDialog } from '../../../../store/modules/blogContentDialogStore';
import _ from 'lodash'

import { ReactComponent as LoginIcon } from '../../../../assets/images/blogContentHeader/login.svg'
import { ReactComponent as Sun } from '../../../../assets/images/blogContentHeader/sun.svg'
import { ReactComponent as Moon } from '../../../../assets/images/blogContentHeader/moon.svg'
import Login from '../Login/Login';
import { produce } from 'immer'
import { fetchNextCategory, setExpandedCategoriesForHeader } from '../../../../store/modules/blogContentNavBarStore';

// Header component
const Header = () => {
    // Redux state selectors
    // const { editable } = useSelector(state => state.mainHeader);
    const { token, tokenValid } = useSelector(state => state.blogContentLogin);
    const { alertDialog } = useSelector(state => state.blogContentDialog);
    // Local state management
    const [showLogin, setShowLogin] = useState(false);
    // const [dropDownValue, setDropDownValue] = useState('View');
    const [inputValue, setInputValue] = useState('');
    const [displayArticles, setDisplayArticles] = useState([]);
    const [hasData, setHasData] = useState(false);

    const dispatch = useDispatch();

    // Refs for DOM elements
    // const buttonRef = useRef(null);
    const searchContainerRef = useRef(null);
    // const hideRef = useRef(null);
    const loginRef = useRef(null);
    const loginIconRef = useRef(null);
    const listRef = useRef(null);
    const inputRef = useRef(null);

    // Effect to handle clicks outside the search container
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setDisplayArticles([]);
                setHasData(false);
                inputRef.current.value = '';
                onInput({ target: { value: '' } });
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchContainerRef]);

    // Effect to handle clicks outside the login container
    useEffect(() => {
        function handleClickOutside(event) {
            if (loginRef.current && !loginRef.current.contains(event.target) && !loginIconRef.current.contains(event.target)) {
                setShowLogin(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [loginRef, loginIconRef]);

    // Effect to highlight search terms in articles
    useEffect(() => {
        if (hasData) {
            let allText = [];
            let wordsToHighlight = inputValue.split(' ');
            Array.from(listRef.current.children).forEach(child => {
                allText.push(child.children[0].textContent);
            });

            wordsToHighlight.forEach(word => {
                for (let i = 0; i < allText.length; i++) {
                    const regex = new RegExp(`\\b${word.trim()}\\b`, 'gi');
                    allText[i] = allText[i].replace(regex, match => `<mark>${match}</mark>`);
                }
            });

            Array.from(listRef.current.children).forEach(child => {
                child.children[0].innerHTML = allText.shift();
            });
        }
    }, [hasData, inputValue]);

    // Toggle view/edit mode
    // const viewExp = () => {
    //     dispatch(editStatus());
    //     if (!editable)
    //         buttonRef.current.style.backgroundColor = '#E8E8E8';
    //     else
    //         buttonRef.current.style.backgroundColor = 'white';
    // };

    // // Handle dropdown selection
    // function selectDropdown() {
    //     dispatch(editStatus());
    //     setDropDownValue('Edit' === dropDownValue ? 'View' : 'Edit');
    //     buttonRef.current.style.backgroundColor = 'white';
    // }

    // Handle input changes in the search bar
    const onInput = async (e) => {
        var term = e.target.value;
        if (term.trim() === '') {
            setInputValue('');
            setDisplayArticles([]);
            return;
        }
        setInputValue(term.trim());
    };

    // Fetch articles based on search term
    const getArticles = useCallback(async (term) => {
        setDisplayArticles([]);
        setHasData(false);

        var url = `${process.env.REACT_APP_API_URL}/articles/${term}`;

        fetchData(
            url,
            'get',
            null,
            (data) => {
                if (data.length === 0) {
                    setHasData(false);
                    dispatch(editErrorMsg({ type: 'WARNING', msg: `No articles found for ${term}` }));
                } else {
                    var articleArray = [];
                    data.forEach((article) => {
                        articleArray.push({
                            id: article.id,
                            content: article.part_content,
                            category: article.category,
                            category_id: article.category_id
                        });
                    });

                    setDisplayArticles(articleArray);
                    setHasData(true);
                    setInputValue(term);
                }
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }));
            }
        );
    }, [dispatch]);

    // Debounce fetching articles to optimize performance
    useEffect(() => {
        const debouncedFetchArticles = _.debounce(async () => {
            if (inputValue) {
                await getArticles(inputValue);
            }
        }, 700);
        debouncedFetchArticles();
        return () => {
            debouncedFetchArticles.cancel();
        };
    }, [getArticles, inputValue]);

    // Handle article click
    const onClickArticle = async (article_id, category) => {
        const categoryNames = Object.values(category).filter(value => value !== null);

        dispatch(getArticleInfo(article_id, categoryNames));

        for (let i = 0; i < categoryNames.length; i++) {
            await dispatch(fetchNextCategory(false, ...categoryNames.slice(0, i + 1)));
            dispatch(setExpandedCategoriesForHeader(categoryNames.slice(0, i + 1)));
        }

        inputRef.current.value = '';
        onInput({ target: { value: '' } });
    };

    // Handle login icon click
    const clickLoginIcon = () => {
        if (token === '' || token === null) {
            setShowLogin(prev => !prev);
        } else {
            let uptAlertDialog = produce(alertDialog, draft => {
                draft.open = true;
                draft.dialogTitle = 'Log Out?';
                draft.dialogText = 'Are you sure to log out';
                draft.dest = 'LogOutConfirm';
            });
            dispatch(editAlertDialog(uptAlertDialog));
        }
    };

    const editTheme = () => {

    }


    // Effect to update login icon color based on token validation
    useEffect(() => {
        const loginIconNode = loginIconRef.current;
        const updateIconColor = (color1, color2, color3) => {
            if (!loginIconNode) return;
            const paths = loginIconNode.querySelectorAll('path');
            if (paths.length >= 3) {
                paths[0].setAttribute('fill', color1);
                paths[1].setAttribute('fill', color2);
                paths[2].setAttribute('fill', color3);
            }
        };

        if (tokenValid) {
            updateIconColor('green', 'green', 'yellow');

            loginIconNode.classList.add('hover');
            const timeoutId = setTimeout(() => {
                loginIconNode.classList.remove('hover');
            }, 1000);

            return () => {
                clearTimeout(timeoutId);
                loginIconNode.classList.remove('hover');
            };
        } else {
            updateIconColor('none', 'none', 'red');
        }
    }, [loginIconRef, tokenValid]);

    return (
        // Header HTML structure
        <div className="header">
            {/* Avatar */}
            <div className="header__avatar">
                <img src={avatar} alt='avatar' />
            </div>
            {/* Search bar */}
            <div className="header__search_bar" ref={searchContainerRef}>
                <input
                    type="text"
                    className="header__search"
                    placeholder="Type to search"
                    onChange={(e) => onInput(e)}
                    ref={inputRef}
                />
                {/* Display articles */}
                {hasData && (
                    <ul className="header__display" ref={listRef}>
                        {displayArticles.map(item => (
                            <li
                                key={item.id}
                                className={classNames('header__display_item')}
                                onClick={() => onClickArticle(item.id, item.category)}
                            >
                                <span>...&nbsp;{item.content}&nbsp;...</span>
                                {/* Show categories */}
                                <div className="header__categories">
                                    <span>
                                        {item.category.first_category}
                                    </span>
                                    <span className={classNames({ cate_hide: item.category.second_category === null })}>
                                        &nbsp;--&nbsp;{item.category.second_category}
                                    </span>
                                    <span className={classNames({ cate_hide: item.category.third_category === null })}>
                                        &nbsp;--&nbsp;{item.category.third_category}
                                    </span>
                                    <span className={classNames({ cate_hide: item.category.fourth_category === null })}>
                                        &nbsp;--&nbsp;{item.category.fourth_category}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Header attributes - right side */}
            <div className="header__attrs">
                {/* Theme */}
                <div className="header__theme" onClick={() => {
                    editTheme()
                }}>
                    <Sun
                        style={{ height: '2rem', width: '2rem' }}
                    />
                </div>

                {/* Login */}
                <div className="header__login" ref={loginIconRef}>
                    <LoginIcon
                        style={{
                            height: '2rem',
                            width: '2rem',
                        }}
                        title={tokenValid ? 'logout' : 'login'}
                        onClick={clickLoginIcon}
                    />
                </div>
                {showLogin && <Login ref={loginRef} setShowLogin={setShowLogin} loginIconRef={loginIconRef} />}
            </div>
        </div>
    );
}

export default Header;