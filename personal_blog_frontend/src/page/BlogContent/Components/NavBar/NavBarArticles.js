import './NavBarArticles.css'
import { useSelector} from 'react-redux'
import classNames from 'classnames'

const NavBarArticles = () => {
    const { currentExpandedCategory } = useSelector(state => state.blogContentNavbar.currentExpandedCategory)
    const { categoryName, categoryValue } = useSelector(state => state.blogContentNavbar.currentCategoryInfo)
    return (

        < div className={classNames({ 'nav-bar__category_article': currentExpandedCategory.hasOwnProperty(categoryName) })
        }>
            {
                currentExpandedCategory.hasOwnProperty(categoryName) &&
                categoryValue['articles'] !== null &&
                (
                    Object.entries(categoryValue['articles']).map(([id, title]) => (

                        <li className={classNames("nav-bar__second-category-items")}
                            key={id}>
                            <div className="nav-bar__category_div">
                                <div className="nav-bar__category_name">
                                    {/* arrow icon - always hide for articles */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        className={
                                            classNames(
                                                { hideFileArrow: true },
                                                { imgRotate: false }
                                            )
                                        }>
                                        <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" /></svg>


                                    {/* article icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className='Nav-bar__article-icon'>
                                        <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                                    </svg>

                                    {/* title of the article */}
                                    <span>{title}</span>

                                </div>
                            </div>
                        </li>
                    ))

                )
            }
        </div >
    )
}

export default NavBarArticles