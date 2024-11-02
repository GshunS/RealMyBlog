import './ErrorPopUp.css'
import className from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'

const ErrorPopUp = () => {
    const dispatch = useDispatch()
    const { type, msg } = useSelector(state => state.blogContentErrorPopUp)

    useEffect(() => {
        const c = document.querySelector('.ErrorPopUp').classList
        let timer = null;

        if (msg !== "") {
            if (c.contains('ErrorPopUp__Move')) {
                c.remove('ErrorPopUp__Move')
            }
            c.add('ErrorPopUp__Move')
            timer = setTimeout(() => {
                c.remove('ErrorPopUp__Move')
                dispatch(editErrorMsg({ type: '', msg: '' }))
            }, 3000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [dispatch, msg])
    return (
        <div className={className("ErrorPopUp")}>
            <div className="ErrorPopUp__Content">
                {type === 'INFO' && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className='ErrorPopUp__INFO'>
                        <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                    </svg>
                )}
                {type === 'WARNING' && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100"
                        className='ErrorPopUp__WARNING'>
                        <circle cx="50" cy="50" r="45" stroke="#f39c11" strokeWidth="10"  />
                        <line x1="50" y1="20" x2="50" y2="60" stroke="#f39c11" strokeWidth="10" />
                        <circle cx="50" cy="75" r="5" fill="#f39c11" />
                    </svg>
                )}
                {type === 'ERROR' && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className='ErrorPopUp__ERROR'>
                        <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" />
                    </svg>
                )}
                <span> {msg} </span>
            </div>
        </div>
    )
}

export default ErrorPopUp