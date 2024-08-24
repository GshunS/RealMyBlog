import './NavBar.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import classNames from 'classnames'
import { fetchData } from '../../../../utils/apiService'
import { clearTempElements } from '../../../../utils/folderArticleHelper'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import {
    fetchNextCategory,
    editAllCategories,
    editTempFolderCreated,
    editExpandedCategories,
    editFolderCreated,
    editFileHid,
    editFolderDeleted,
    editCurrentAncestorNames
} from '../../../../store/modules/blogContentNavBarStore'
import { editAddType } from '../../../../store/modules/blogContentFolderFileCreationWindow'
import { useDispatch, useSelector } from 'react-redux'
import NavBarArticles from './NavBarArticles'
import NavBarCategories from './NavBarCategories'
// import NavBarTempFolder from './NavBarTempFolder'
// category navigation bar
const NavBar = () => {

    const dispatch = useDispatch()
    // the expandedCategories state is used to keep track of which categories are expanded
    // allCategories state is used to store all the categories and subcategories
    const {
        expandedCategories,
        allCategories,
        tempFolderCreated,
        folderCreated,
        fileHid,
        folderDeleted,
        currentAncestorNames } = useSelector(state => state.blogContentNavbar)

    const [expandedElements, setExpandedElements] = useState(new Set())
    const refMap = useRef([])
    const heightRef = useRef(0)

    // set ref for each temporary folder
    const setRef = useCallback((element) => {
        if (element) {
            refMap.current.push(element);
        } else {
            // Handle cleanup when the component is unmounted or the element is removed
            refMap.current = refMap.current.filter(ref => ref !== element);
        }
    }, []);

    const getExpandedElement = useCallback(() => {
        const nodelist = document.querySelectorAll('.expanded')
        const newExpandedElement = Array.from(nodelist).find(element => !expandedElements.has(element))
        const newCollapseElement = Array.from(expandedElements).find(element => !Array.from(nodelist).includes(element))
        return { newExpandedElement, newCollapseElement, nodelist }

    }, [expandedElements])

    // click outside the temp folder, cancel the creation of the temp folder
    useEffect(() => {
        const handleClickOutside = (event) => {
            // console.log(tempFolderCreated)
            if (tempFolderCreated) {
                dispatch(editTempFolderCreated(false))
                return
            }
            let isOutside = true
            Object.values(refMap.current).forEach((ref) => {
                if (ref && ref.contains(event.target)) {
                    isOutside = false
                }
            })
            const folderElement = document.querySelector(".showFolder")
            if (isOutside && folderElement) {
                clearTempElements('.showFolder')
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [dispatch, tempFolderCreated])

    // scroll to the expanded category
    useEffect(() => {
        const timer = setTimeout(() => {

            const { newExpandedElement, newCollapseElement, nodelist } = getExpandedElement()
            if (newExpandedElement) {

                let parentElement = newExpandedElement.parentElement

                while (parentElement && !parentElement.classList.contains('nav-bar__first-category-items')) {
                    parentElement = parentElement.parentElement
                }
                const marginTop = 16

                window.scrollTo({
                    top: parentElement.offsetTop - marginTop,
                    behavior: 'smooth'
                })
            }
            if (!(newExpandedElement === undefined && newCollapseElement === undefined)) {
                setExpandedElements(new Set(nodelist))
            }
        }, 100)


        return () => clearTimeout(timer)
    }, [expandedCategories, getExpandedElement])

    // // set height dynamically
    // useEffect(() => {

    //     const { newExpandedElement, newCollapseElement } = getExpandedElement()
    //     if (newExpandedElement) {
    //         setTimeout(()=>{
    //             console.log(heightRef.current.scrollHeight)
    //         }, 600)

    //     }
    //     if (newCollapseElement) {
    //         setTimeout(()=>{
    //             console.log(heightRef.current.scrollHeight)
    //         }, 600)
    //     }

    // }, [expandedCategories, getExpandedElement])


    // fetch the first category
    useEffect(() => {
        async function fetchInitialData() {
            var url = `https://localhost:7219/api/categories/first-category`
            // fetch the first category
            await fetchData(
                url,
                'get',
                null,
                (data) => dispatch(editAllCategories(data)),
                (error) => {
                    dispatch(editErrorMsg(`${error}`))
                    console.log('An error occurred:', error)
                }
            );

        }
        fetchInitialData()
    }, [dispatch])

    // if a new sub category(not level 1 category) has been created, refresh the data
    useEffect(() => {
        async function updateData() {
            if (folderCreated) {
                if (currentAncestorNames.length > 0) {
                    let nestedObject = {};
                    let tempNames = currentAncestorNames.slice()
                    tempNames.pop()
                    tempNames.reduce((acc, currentValue) => {
                        acc[currentValue] = {};
                        return acc[currentValue];
                    }, nestedObject);
                    dispatch(editExpandedCategories(nestedObject))
                    await dispatch(fetchNextCategory(null, ...currentAncestorNames));
                } else {
                    var url = `https://localhost:7219/api/categories/first-category`
                    // fetch the first category
                    await fetchData(
                        url,
                        'get',
                        null,
                        (data) => {
                            dispatch(editExpandedCategories({}))
                            dispatch(editAllCategories(data))
                        },
                        (error) => {
                            dispatch(editErrorMsg(`${error}`))
                            console.log('An error occurred:', error)
                        }
                    )
                }
                dispatch(editFolderCreated(false))
            }

        }
        updateData()
    }, [folderCreated, dispatch, currentAncestorNames])

    // if an article has been deleted(hide), refresh the data
    useEffect(() => {
        async function updateData() {
            if (currentAncestorNames.length > 0 && (fileHid)) {
                let nestedObject = {};

                if (currentAncestorNames.length === 1) {
                    dispatch(editExpandedCategories(nestedObject))
                    // fetchInitialData()
                    var url = `https://localhost:7219/api/categories/first-category`
                    // fetch the first category
                    await fetchData(
                        url,
                        'get',
                        null,
                        (data) => dispatch(editAllCategories(data)),
                        (error) => {
                            dispatch(editErrorMsg(`${error}`))
                            console.log('An error occurred:', error)
                        }
                    );
                } else {
                    let tempNames = currentAncestorNames.slice()
                    tempNames.pop()

                    let initialExpand = tempNames.slice()
                    initialExpand.pop()

                    initialExpand.reduce((acc, currentValue) => {
                        acc[currentValue] = {};
                        return acc[currentValue];
                    }, nestedObject);
                    dispatch(editExpandedCategories(nestedObject))
                    await dispatch(fetchNextCategory(null, ...tempNames));
                }
                await dispatch(fetchNextCategory(null, ...currentAncestorNames));
                dispatch(editFileHid(false))

            }

        }
        updateData()
    }, [fileHid, dispatch, currentAncestorNames])

    // if a sub category has been deleted, refresh the data
    useEffect(() => {
        async function updateData() {
            if (currentAncestorNames.length > 0 && (folderDeleted)) {
                let nestedObject = {};

                if (currentAncestorNames.length === 1) {
                    dispatch(editExpandedCategories(nestedObject))
                    // fetchInitialData()
                    var url = `https://localhost:7219/api/categories/first-category`
                    // fetch the first category
                    await fetchData(
                        url,
                        'get',
                        null,
                        (data) => dispatch(editAllCategories(data)),
                        (error) => {
                            dispatch(editErrorMsg(`${error}`))
                            console.log('An error occurred:', error)
                        }
                    );
                } else {
                    let tempNames = currentAncestorNames.slice()
                    tempNames.pop()

                    let initialExpand = tempNames.slice()
                    initialExpand.pop()

                    initialExpand.reduce((acc, currentValue) => {
                        acc[currentValue] = {};
                        return acc[currentValue];
                    }, nestedObject);
                    dispatch(editExpandedCategories(nestedObject))
                    await dispatch(fetchNextCategory(null, ...tempNames));
                }
                dispatch(editFolderDeleted(false))
            }

        }
        updateData()
    }, [folderDeleted, dispatch, currentAncestorNames])

    const callCreationWindow = (type) => {
        dispatch(editExpandedCategories({}))
        dispatch(editAddType(type))
        dispatch(editCurrentAncestorNames([]))
    }

    return (
        <div className="nav-bar">
            {/* navigation title */}
            <div className="nav-bar__name">
                <span>Blog Navigation</span>
            </div>

            <div className="nav-bar__categories">
                {/* first category */}
                <ul className="nav-bar__first-category" ref={heightRef}>

                    {/* firstCategoryName: name for level 1 category */}
                    {/* firstCategoryValue: {hasChildren:true, subCategories:null, articles:null} */}
                    {(allCategories !== null) &&
                        (Object.entries(allCategories).map(([firstCategoryName, firstCategoryValue], index) => (
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
                                    {/* <div
                                        ref={setRef}>
                                        <NavBarTempFolder ancestorCategoryNames={[firstCategoryName]} />
                                    </div> */}

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
                                                    {/* <div
                                                        ref={setRef}>
                                                        <NavBarTempFolder ancestorCategoryNames={[firstCategoryName, secondCategoryName]} />
                                                    </div> */}

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
                                                                    {/* <div
                                                                        ref={setRef}>
                                                                        <NavBarTempFolder ancestorCategoryNames={[firstCategoryName, secondCategoryName, thirdCategoryName]} />
                                                                    </div> */}
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
                                                                                        ancestorCategoryNames={[firstCategoryName, secondCategoryName, thirdCategoryName, fourthCategoryName]}
                                                                                        expandedCategoriesInfo={{ categoryName: fourthCategoryName, categoryValue: fourthCategoryValue }} />
                                                                                </ul>

                                                                            </li>
                                                                        ))

                                                                    )}

                                                                    {/* Articles under level 3 category */}
                                                                    <NavBarArticles
                                                                        expandedCategories={expandedCategories[firstCategoryName][secondCategoryName]}
                                                                        ancestorCategoryNames={[firstCategoryName, secondCategoryName, thirdCategoryName]}
                                                                        expandedCategoriesInfo={{ categoryName: thirdCategoryName, categoryValue: thirdCategoryValue }} />
                                                                </ul>

                                                            </li>
                                                        ))

                                                    )}

                                                    {/* Articles under level 2 category */}
                                                    <NavBarArticles
                                                        expandedCategories={expandedCategories[firstCategoryName]}
                                                        ancestorCategoryNames={[firstCategoryName, secondCategoryName]}
                                                        expandedCategoriesInfo={{ categoryName: secondCategoryName, categoryValue: secondCategoryValue }} />
                                                </ul>

                                            </li>
                                        ))

                                    )}

                                    {/* Articles under level 1 category */}
                                    <NavBarArticles
                                        expandedCategories={expandedCategories}
                                        expandedCategoriesInfo={{ categoryName: firstCategoryName, categoryValue: firstCategoryValue }}
                                        ancestorCategoryNames={[firstCategoryName]} />
                                </ul>


                            </li>
                        )))}

                </ul>

            </div>
            <div className="nav-bar__addCate__button" onClick={() => callCreationWindow('folder')}>
                <div className="nav-bar__addCate_inner">
                    <span>Add Category</span>
                </div>
            </div>
        </div>
    )
}


export default NavBar