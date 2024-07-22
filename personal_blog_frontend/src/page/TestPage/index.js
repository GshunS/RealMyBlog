import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../store/modules/counterStore'
import { fetchAuthorList } from '../../store/modules/authorStore'
import { useEffect } from 'react'


const TestPage = () => {
    const { count } = useSelector(state => state.counter)
    const { author_list } = useSelector(state => state.author)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAuthorList())
    }, [dispatch])


    return (
        <div className="TestPage">
            <button onClick={() => dispatch(decrement())}>-</button>
            <span>{count}</span>
            <button onClick={() => dispatch(increment())}>+</button>

            <ul>
                {author_list.map(item => <li key={item.id}>{item.third_category}</li>)}
            </ul>
        </div>
    );
}

export default TestPage