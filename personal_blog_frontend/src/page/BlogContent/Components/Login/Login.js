import './Login.css'

const Login = () => {
    return (
        <div className="login-container">
            <div className="top"></div>
            <div className="bottom"></div>
            <div className="center">
                <h3>Please Sign In</h3>
                <input type="email" placeholder="username" />
                <input type="password" placeholder="password" />
                <button type='submit' className='login-button'>Login</button>

            </div>
        </div>
    )
}
export default Login;