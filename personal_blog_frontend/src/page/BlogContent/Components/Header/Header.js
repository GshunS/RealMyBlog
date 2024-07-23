import { useState, useRef } from 'react';

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

    const dispatch = useDispatch();

    // buttonRef is a reference to the button element (view/edit)
    const buttonRef = useRef(null);

    // hideRef is a reference to the dropdown element
    const hideRef = useRef(null);

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
        
        if (term === '' || inputValue === term.trim()) return
        setInputValue(term)
        await getArticles(term)
    }

    const onKeyDown = async (e) => {
        if (e.key === 'Enter') {
            var term = e.target.value
            console.log(term)
        
            if (term === '' || inputValue === term.trim()) return
            setInputValue(term)
            await getArticles(term)
        }
    }

    // getArticles is a function that is used to get the articles by full text search from the backend
    const getArticles = async (term) => {
        if (displayArticles.length > 0) {
            setDisplayArticles([])
        }
        var url = `https://localhost:7219/api/articles/${term}`;
        try {
            const response = await axios.get(url);
            if (response.data.length === 0) {
                setDisplayArticles([`No articles found for ${term}`])
            }else{
                setDisplayArticles('found')
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
                    onInput={(e) => onInput(e)}
                    onKeyDown={(e) => onKeyDown(e)} 
                    />
            </div>
            {/* display articles */}
            <div className="tesst">{displayArticles}</div>
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