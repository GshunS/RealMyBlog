import './NavBar.css'
import angleup from '../../../../assets/images/angle-up-solid.svg'
import addfolder from '../../../../assets/images/folder-plus-solid.svg'
import addfile from '../../../../assets/images/file-circle-plus-solid.svg'
import { useEffect, useState } from 'react'
import classNames from 'classnames';
import axios from 'axios'

const NavBar = () => {
    const [firstCategoryList, setFirstCategoryList] = useState({})
    // const [secondCategoryObject, setSecondCategoryObject] = useState({})
    const [secondCategoryName, setSecondCategoryName] = useState({})
    const [secondCategoryArticle, setSecondCategoryArticle] = useState({})

    const [thirdCategoryName, setThirdCategoryName] = useState({})
    const [thirdCategoryArticle, setThirdCategoryArticle] = useState({})
    const [expandedCategories, setExpandedCategories] = useState([]);
    
    const [allCategories, setAllCategories] = useState({})

    useEffect(() => {
        async function fetchFirstCategory() {
            var url = `https://localhost:7219/api/categories/first-category`;
            try {
                const response = await axios.get(url)
                setAllCategories(response.data)
                console.log(response.data)
            } catch (error) {
                if (error.response) {
                    const status = error.response.status;
                    if (status === 400) {
                        console.log([`Bad Request: ${error.response.data}`])
                    } else if (status === 500) {
                        console.log([`Internal Server Error: ${error.response.data}`])
                    } else {
                        console.log([`Error: ${error.response.data}`])
                    }
                } else {
                    console.log([`No response received`])
                }
            }
        }
        fetchFirstCategory()
    }, [])

    const getSecondCategory = async (firstCategory) => {
        console.log(firstCategory)
        // var url = `https://localhost:7219/api/categories/first_category/${firstCategory}`;
        // try {
        //     const response = await axios.get(url)
        //     console.log(response.data)
        //     setSecondCategoryName((preName) => ({
        //         ...preName,
        //         [firstCategory]: response.data.categoryDict
        //     }))

        //     setSecondCategoryArticle((preArticle) => ({
        //         ...preArticle,
        //         [firstCategory]: response.data.articles
        //     }))
        //     setExpandedCategories((prevExpanded) => {
        //         if (prevExpanded.includes(firstCategory)) {
        //             // If the category is already expanded, collapse it
        //             return prevExpanded.filter((category) => category !== firstCategory);
        //         } else {
        //             // If the category is not expanded, expand it
        //             return [...prevExpanded, firstCategory];
        //         }
        //     });

        // } catch (error) {
        //     if (error.response) {
        //         const status = error.response.status;
        //         if (status === 400) {
        //             console.log([`Bad Request: ${error.response.data}`])
        //         } else if (status === 500) {
        //             console.log([`Internal Server Error: ${error.response.data}`])
        //         } else {
        //             console.log([`Error: ${error.response.data}`])
        //         }
        //     } else {
        //         console.log([`No response received`])
        //     }
        // }

    }

    const getThirdCategory = async (firstCategory, secondCategory) => {
        console.log(firstCategory, secondCategory)
    }

    return (
        <div className="nav-bar">
            <div className="nav-bar__name">
                <span>Blog Navigation</span>
            </div>

            <div className="nav-bar__categories">
                <ul className="nav-bar__first-category">
                    {Object.entries(allCategories).map(([firstCategoryName, firstCategoryValue], index) => (
                        <li className="nav-bar__first-category-items"
                            key={index}>
                            <div className="nav-bar__category_div">
                                <div className="nav-bar__category_name"
                                    onClick={() => getSecondCategory(firstCategoryName)}>
                                    <img
                                        src={angleup}
                                        alt="arrow"
                                        className={
                                            classNames(
                                                { hideFileArrow: !firstCategoryValue.hasChildren},
                                                { imgRotate: expandedCategories.includes(firstCategoryName) }
                                            )
                                        }
                                    />
                                    {expandedCategories.includes(firstCategoryName) && firstCategoryValue.hasChildren ?
                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg>
                                        ) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>
                                        )
                                    }
                                    <span>{firstCategoryName}</span>

                                </div>
                                <div className="nav-bar__category_img">
                                    <img src={addfolder} alt="addfolder" title='create a folder' />
                                    <img src={addfile} alt="addfile" title='create a file' />
                                </div>

                            </div>
                            
                        </li>
                    ))}

                </ul>

            </div>
        </div>
    )
}


export default NavBar