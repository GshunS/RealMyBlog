import './NavBar.css'
// import './waste.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import { editAllCategories, editTempFolderCreated } from '../../../../store/modules/blogContentNavBarStore'
import { useDispatch, useSelector } from 'react-redux'
import NavBarArticles from './NavBarArticles'
import NavBarCategories from './NavBarCategories'
import NavBarTempFolder from './NavBarTempFolder'
// category navigation bar
const NavBar = () => {

    const dispatch = useDispatch()
    // the expandedCategories state is used to keep track of which categories are expanded
    // allCategories state is used to store all the categories and subcategories
    const { expandedCategories, allCategories } = useSelector(state => state.blogContentNavbar)
    const tempFolderCreated = useSelector(state => state.blogContentNavbar.tempFolderCreated)
    const [expandedElements, setExpandedElements] = useState(new Set())
    const refMap = useRef({});

    const setRef = useCallback((index) => (element) => {
        refMap.current[index] = element;
    }, []);


    const getExpandedElement = () => {
        const nodelist = document.querySelectorAll('.expanded')
        const newExpandedElement = Array.from(nodelist).find(element => !expandedElements.has(element))
        const newCollapseElement = Array.from(expandedElements).find(element => !Array.from(nodelist).includes(element))
        return { newExpandedElement, newCollapseElement, nodelist }

    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log(tempFolderCreated)
            if (tempFolderCreated) {
                // console.log('tempFolderCreated change to false')
                dispatch(editTempFolderCreated(false))
                return;
            }
            let isOutside = true;
            Object.values(refMap.current).forEach((ref) => {
                if (ref && ref.contains(event.target)) {
                    isOutside = false;
                }
            });
            const folderElement = document.querySelector(".showFolder")

            if (isOutside && folderElement) {
                Object.values(refMap.current).forEach((ref) => {
                    if (ref) {
                        const children = ref.querySelectorAll('.showFolder');
                        children.forEach(child => {
                            // console.log(child)
                            child.classList.remove('showFolder');
                        });
                    }
                });
                window.location.reload()
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [tempFolderCreated, dispatch]);

    // scroll to the expanded category
    useEffect(() => {
        const timer = setTimeout(() => {

            const { newExpandedElement, nodelist } = getExpandedElement()
            if (newExpandedElement) {

                let parentElement = newExpandedElement.parentElement;

                while (parentElement && !parentElement.classList.contains('nav-bar__first-category-items')) {
                    parentElement = parentElement.parentElement;
                }
                const marginTop = 16;

                window.scrollTo({
                    top: parentElement.offsetTop - marginTop,
                    behavior: 'smooth'
                });
            }
            setExpandedElements(new Set(nodelist))
        }, 100)


        return () => clearTimeout(timer)
    }, [expandedCategories])

    // fetch the first category
    useEffect(() => {
        async function fetchFirstCategory() {
            var url = `https://localhost:7219/api/categories/first-category`
            try {
                const response = await axios.get(url)
                dispatch(editAllCategories(response.data))

            } catch (error) {
                if (error.response) {
                    const status = error.response.status
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
    }, [dispatch])

    // const collapseAll = () => {
    //     setExpandedCategories({})
    // }



    return (
        <div className="nav-bar">
            {/* navigation title */}
            <div className="nav-bar__name">
                <span>Blog Navigation</span>
            </div>  
            
            <div className="nav-bar__categories">
                {/* first category */}
                <ul className="nav-bar__first-category">

                    {/* firstCategoryName: name for level 1 category */}
                    {/* firstCategoryValue: {hasChildren:true, subCategories:null, articles:null} */}
                    {Object.entries(allCategories).map(([firstCategoryName, firstCategoryValue], index) => (
                        <li className="nav-bar__first-category-items"
                            key={index}
                        >

                            {/* level 1 category <li> content */}
                            <NavBarCategories
                                ancestorCategoryNames={[firstCategoryName]}
                                expandedCategories={expandedCategories}
                                expandedCategoriesInfo={{ categoryName: firstCategoryName, categoryValue: firstCategoryValue }}
                                categories={[firstCategoryName]}
                            />

                            {/* second category */}
                            <ul className={
                                classNames(
                                    "nav-bar__second-category",
                                    { "expanded": expandedCategories.hasOwnProperty(firstCategoryName) },
                                    { "nav-bar__has-child": !firstCategoryValue.hasChildren }
                                )}
                            >
                                <div
                                    ref={setRef(index)}>
                                    <NavBarTempFolder ancestorCategoryNames={[firstCategoryName]} />
                                </div>

                                {/* if the parent category has been clicked, show all children categories */}
                                {expandedCategories.hasOwnProperty(firstCategoryName) && (
                                    // secondCategoryValue: {hasChildren:true, subCategories:null, articles:null}

                                    Object.entries(firstCategoryValue["subCategories"]).map(([secondCategoryName, secondCategoryValue], secondIndex) => (

                                        <li className={classNames("nav-bar__second-category-items")}
                                            key={secondIndex}>
                                            {/* level 2 category <li> content */}

                                            <NavBarCategories
                                                ancestorCategoryNames={[firstCategoryName, secondCategoryName]}
                                                expandedCategories={expandedCategories[firstCategoryName]}
                                                expandedCategoriesInfo={{ categoryName: secondCategoryName, categoryValue: secondCategoryValue }}
                                                categories={[firstCategoryName, secondCategoryName]}
                                            />

                                            {/* third category */}
                                            <ul className={
                                                classNames(
                                                    "nav-bar__third-category",
                                                    { "expanded": expandedCategories[firstCategoryName].hasOwnProperty(secondCategoryName) },
                                                    { "nav-bar__has-child": !secondCategoryValue.hasChildren }
                                                )}>
                                                <NavBarTempFolder ancestorCategoryNames={[firstCategoryName, secondCategoryName]} />
                                                {/* if the parent category has been clicked, show all children categories */}
                                                {expandedCategories[firstCategoryName].hasOwnProperty(secondCategoryName) && (

                                                    // thirdCategoryValue: {hasChildren:true, subCategories:null, articles:null}
                                                    Object.entries(secondCategoryValue["subCategories"]).map(([thirdCategoryName, thirdCategoryValue], thirdIndex) => (
                                                        <li className={classNames("nav-bar__third-category-items")}
                                                            key={thirdIndex}>

                                                            {/* level 3 category <li> content */}
                                                            <NavBarCategories
                                                                ancestorCategoryNames={[firstCategoryName, secondCategoryName, thirdCategoryName]}
                                                                expandedCategories={expandedCategories[firstCategoryName][secondCategoryName]}
                                                                expandedCategoriesInfo={{ categoryName: thirdCategoryName, categoryValue: thirdCategoryValue }}
                                                                categories={[firstCategoryName, secondCategoryName, thirdCategoryName]}
                                                            />

                                                            {/* fourth category */}
                                                            <ul
                                                                className={
                                                                    classNames(
                                                                        "nav-bar__fourth-category",
                                                                        { "expanded": expandedCategories[firstCategoryName][secondCategoryName].hasOwnProperty(thirdCategoryName) },
                                                                        { "nav-bar__has-child": !thirdCategoryValue.hasChildren }
                                                                    )
                                                                }>
                                                                <NavBarTempFolder ancestorCategoryNames={[firstCategoryName, secondCategoryName, thirdCategoryName]} />
                                                                {/* if the parent category has been clicked, show all children categories */}
                                                                {expandedCategories[firstCategoryName][secondCategoryName].hasOwnProperty(thirdCategoryName) && (

                                                                    // fourthCategoryValue: {hasChildren:true, subCategories:null, articles:null}
                                                                    Object.entries(thirdCategoryValue["subCategories"]).map(([fourthCategoryName, fourthCategoryValue], fourthIndex) => (
                                                                        <li className={classNames("nav-bar__fourth-category-items")}
                                                                            key={fourthIndex}>
                                                                            {/* level 4 category <li> content */}
                                                                            <NavBarCategories
                                                                                ancestorCategoryNames={[firstCategoryName, secondCategoryName, thirdCategoryName, fourthCategoryName]}
                                                                                expandedCategories={expandedCategories[firstCategoryName][secondCategoryName][thirdCategoryName]}
                                                                                expandedCategoriesInfo={{ categoryName: fourthCategoryName, categoryValue: fourthCategoryValue }}
                                                                                categories={[firstCategoryName, secondCategoryName, thirdCategoryName, fourthCategoryName]}
                                                                            />

                                                                            {/* Articles under level 4 category */}
                                                                            <ul
                                                                                className={
                                                                                    classNames(
                                                                                        "nav-bar__fourth-category",
                                                                                        { "expanded": expandedCategories[firstCategoryName][secondCategoryName][thirdCategoryName].hasOwnProperty(fourthCategoryName) },
                                                                                        { "nav-bar__has-child": !fourthCategoryValue.hasChildren }
                                                                                    )
                                                                                }>

                                                                                <NavBarArticles
                                                                                    expandedCategories={expandedCategories[firstCategoryName][secondCategoryName][thirdCategoryName]}
                                                                                    expandedCategoriesInfo={{ categoryName: fourthCategoryName, categoryValue: fourthCategoryValue }} />
                                                                            </ul>

                                                                        </li>
                                                                    ))

                                                                )}

                                                                {/* Articles under level 3 category */}
                                                                <NavBarArticles
                                                                    expandedCategories={expandedCategories[firstCategoryName][secondCategoryName]}
                                                                    expandedCategoriesInfo={{ categoryName: thirdCategoryName, categoryValue: thirdCategoryValue }} />
                                                            </ul>

                                                        </li>
                                                    ))

                                                )}

                                                {/* Articles under level 2 category */}
                                                <NavBarArticles
                                                    expandedCategories={expandedCategories[firstCategoryName]}
                                                    expandedCategoriesInfo={{ categoryName: secondCategoryName, categoryValue: secondCategoryValue }} />
                                            </ul>

                                        </li>
                                    ))

                                )}

                                {/* Articles under level 1 category */}
                                <NavBarArticles
                                    expandedCategories={expandedCategories}
                                    expandedCategoriesInfo={{ categoryName: firstCategoryName, categoryValue: firstCategoryValue }} />
                            </ul>


                        </li>
                    ))}

                </ul>

            </div>
        </div>
    )
}


export default NavBar