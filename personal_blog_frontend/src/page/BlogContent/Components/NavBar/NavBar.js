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
    const [expandedCategories, setExpandedCategories] = useState([]);

    useEffect(() => {
        async function fetchFirstCategory() {
            var url = `https://localhost:7219/api/categories/first-category`;
            try {
                const response = await axios.get(url)
                setFirstCategoryList(response.data)
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
        var url = `https://localhost:7219/api/categories/first_category/${firstCategory}`;
        try {
            const response = await axios.get(url)
            console.log(response.data)
            setSecondCategoryName((preName) => ({
                ...preName,
                [firstCategory]: response.data.categoryNames
            }))

            setSecondCategoryArticle((preArticle) => ({
                ...preArticle,
                [firstCategory]: response.data.aritcles
            }))
            setExpandedCategories((prevExpanded) => {
                if (prevExpanded.includes(firstCategory)) {
                    // If the category is already expanded, collapse it
                    return prevExpanded.filter((category) => category !== firstCategory);
                } else {
                    // If the category is not expanded, expand it
                    return [...prevExpanded, firstCategory];
                }
            });

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

    // useEffect(()=>{
    //     console.log(secondCategoryName)
    //     // console.log(secondCategoryArticle)
    // }, [secondCategoryName])


    return (
        <div className="nav-bar">
            <div className="nav-bar__name">
                <span>Blog Navigation</span>
            </div>

            <div className="nav-bar__categories">
                <ul className="nav-bar__first-category">
                    {Object.entries(firstCategoryList).map(([firstKey, firstValue], index) => (
                        <li className="nav-bar__first-category-items"
                            key={index}>
                            <div className="nav-bar__category_div">
                                <div className="nav-bar__category_name"
                                    onClick={() => getSecondCategory(firstKey)}>
                                    <img
                                        src={angleup}
                                        alt="arrow"
                                        className={
                                            classNames(
                                                { hideFileArrow: !firstValue },
                                                { imgRotate: expandedCategories.includes(firstKey) }
                                            )
                                        }
                                    />
                                    <span>{firstKey}</span>

                                </div>
                                <div className="nav-bar__category_img">
                                    <img src={addfolder} alt="addfolder" />
                                    <img src={addfile} alt="addfile" />
                                </div>

                            </div>
                            <ul className={classNames("nav-bar__second-category", { "expanded": expandedCategories.includes(firstKey) })}>
                                {expandedCategories.includes(firstKey) && (

                                    secondCategoryName[firstKey].map((secondCategoryName, secondIndex) => (
                                        <li className={classNames("nav-bar__second-category-items")}
                                            key={secondIndex}>
                                            <div className="nav-bar__category_div">
                                                <div className="nav-bar__category_name">
                                                    <img src={angleup} alt="arrow" />
                                                    <span>{secondCategoryName}</span>

                                                </div>
                                                <div className="nav-bar__category_img">
                                                    <img src={addfolder} alt="addfolder" />
                                                    <img src={addfile} alt="addfile" />
                                                </div>

                                            </div>

                                            {/* <ul className="nav-bar__third-category">
                                        <li className="nav-bar__third-category-items">
                                            <div className="nav-bar__category_div">
                                                <div className="nav-bar__category_name">
                                                    <img src={angleup} alt="arrow" />
                                                    <span>{category.third_category}</span>

                                                </div>
                                                <div className="nav-bar__category_img">
                                                    <img src={addfolder} alt="addfolder" />
                                                    <img src={addfile} alt="addfile" />
                                                </div>

                                            </div>
                                        </li>
                                    </ul> */}
                                        </li>
                                    ))


                                )}
                            </ul>
                        </li>
                    ))}

                </ul>

            </div>
        </div>
    )
}


export default NavBar