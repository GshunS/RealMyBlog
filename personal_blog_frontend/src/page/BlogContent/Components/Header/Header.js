import { useState, useRef } from 'react';

import classNames from 'classnames';
import downarrow from '../../../../assets/images/caret-down-solid.svg'
import avatar from '../../../../assets/images/gz.jpg'
import './Header.css';
import { editStatus } from '../../../../store/modules/mainHeaderStore';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const Header = () => {
    const { editable } = useSelector(state => state.mainHeader);
    const [dropDownValue, setDropDownValue] = useState('View');
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();
    const buttonRef = useRef(null);
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
        var url = `http://localhost:7219/api/articles?inputValue=${term}`;
        try {
            // const response = await axios.get(url);
            console.log(url);
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    console.error('Bad Request:', error.response.data);
                } else if (status === 500) {
                    console.error('Internal Server Error:', error.response.data);
                } else {
                    console.error('Error:', error.response.data);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {

                console.error('Error in setting up request:', error.message);
            }
        }
    }


    return (
        <div className="header">
            <div className="header__avatar">
                <img src={avatar} alt='avatar' />
            </div>
            <div className="header__search_bar">
                <input
                    type="text"
                    className="header__search"
                    placeholder="Type to search"
                    onInput={(e) => onInput(e)} />
            </div>
            <div className="header__attrs">
                <div className="header__view">
                    <div className="header__view_button" onClick={() => viewExp()} ref={buttonRef}>
                        <span>{dropDownValue}</span>
                        <img
                            className={classNames('header__view_arrow', { arrow_expand: editable })}
                            src={downarrow}
                            alt="dropdown"
                        />
                    </div>
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
                <div className="header__attr">Theme</div>
                <div className="header__attr">Login</div>
            </div>
        </div>
    );
}

export default Header;