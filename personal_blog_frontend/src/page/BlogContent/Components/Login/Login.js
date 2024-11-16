import './Login.css'
import { useEffect, useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore';
import { fectchLoginToken } from '../../../../store/modules/blogContentLoginStore';
import _ from 'lodash'

const Login = forwardRef(({ setShowLogin, loginIconRef }, loginRef) => {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.blogContentLogin);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const validateLoginField = (username, password) => {
        let error_msg = '';
        if (!username.trim()) {
            error_msg = "Username is required";
        } else if (/\s/.test(username)) {
            error_msg = "Username cannot contain spaces";
        }

        if (!password.trim()) {
            error_msg = "Password is required";
        } else if (/\s/.test(password)) {
            error_msg = "Password cannot contain spaces";
        }
        if (error_msg !== '') {
            dispatch(editErrorMsg({ type: 'WARNING', msg: error_msg }))
            return false;
        }
        return true;
    }

    const handleLoginSubmit = _.debounce(async () => {
        const res = validateLoginField(username, password);
        if (res) {
            dispatch(fectchLoginToken(username, password))
        }
        setShowLogin(false);
    }, [300]);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLoginSubmit();
    }

    useEffect(() => {
        return () => handleLoginSubmit.cancel();
    }, [handleLoginSubmit])



    return (
        <div className="login-container" ref={loginRef}>
            <div className="top"></div>
            <div className="bottom"></div>
            <form onSubmit={handleSubmit}>
                <div className="center">
                    <h3>Please Sign In</h3>

                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="login-button">Login</button>
                </div>
            </form>

        </div>
    );
})
export default Login;