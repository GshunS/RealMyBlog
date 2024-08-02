import './NavBar.css'
// import './waste.css'
import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import axios from 'axios'

// category navigation bar
const NavBar = () => {

    // the expandedCategories state is used to keep track of which categories are expanded
    const [expandedCategories, setExpandedCategories] = useState({})

    // allCategories state is used to store all the categories and subcategories
    const [allCategories, setAllCategories] = useState({})

    const [expandedElements, setExpandedElements] = useState(new Set())

    const getExpandedElement = () => {
        const nodelist = document.querySelectorAll('.expanded')

        const newExpandedElement = Array.from(nodelist).find(element => !expandedElements.has(element))
        const newCollapseElement = Array.from(expandedElements).find(element => !Array.from(nodelist).includes(element))

        return { newExpandedElement, newCollapseElement, nodelist }

    }


    // scroll to the expanded category
    useEffect(() => {
        const timer = setTimeout(() => {

            const { newExpandedElement, nodelist } = getExpandedElement()
            if (newExpandedElement) {

                let parentElement = newExpandedElement.parentElement;

                while (parentElement && !parentElement.classList.contains('nav-bar__first-category-items')) {
                    parentElement = parentElement.parentElement;
                }
                // console.log(parentElement)
                const marginTop = 16;

                window.scrollTo({
                    top: parentElement.offsetTop - marginTop,
                    behavior: 'smooth'
                });
            }
            setExpandedElements(new Set(nodelist))
        }, 200)

        return () => clearTimeout(timer)
    }, [expandedCategories])

    // fetch the first category
    useEffect(() => {
        async function fetchFirstCategory() {
            var url = `https://localhost:7219/api/categories/first-category`
            try {
                const response = await axios.get(url)
                setAllCategories(response.data)
                // console.log(response.data)
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
    }, [])

    // fetch the second category
    const getSecondCategory = async (firstCategory) => {
        var url = `https://localhost:7219/api/categories/first_category/${firstCategory}`

        try {
            const response = await axios.get(url)
            // console.log(response.data)
            setAllCategories((prevData) => {
                return {
                    ...prevData,
                    [firstCategory]: {
                        ...prevData[firstCategory],
                        subCategories: response.data
                    }
                }
            })

            setExpandedCategories((prevExpanded) => {
                if (prevExpanded.hasOwnProperty(firstCategory)) {
                    const newExpanded = { ...prevExpanded }
                    // If the category is already expanded, collapse it
                    delete newExpanded[firstCategory];
                    return newExpanded;

                } else {
                    // If the category is not expanded, expand it
                    if (allCategories[firstCategory].hasChildren) {
                        return {
                            ...prevExpanded,
                            [firstCategory]: {}
                        }
                    } else {
                        return prevExpanded
                    }

                }

            })

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

    // fetch the third category
    const getThirdCategory = async (firstCategory, secondCategory) => {
        // console.log(firstCategory, secondCategory)
        var url = `https://localhost:7219/api/categories/first_category/${firstCategory}/second_category/${secondCategory}`
        try {
            const response = await axios.get(url)
            // console.log(response.data)
            setAllCategories((prevData) => {
                const newExpanded = { ...prevData }
                newExpanded[firstCategory]['subCategories'][secondCategory]['subCategories'] = response.data
                return newExpanded
            })

            setExpandedCategories((prevExpanded) => {
                // console.log(prevExpanded)
                if (prevExpanded.hasOwnProperty(firstCategory)) {
                    if (prevExpanded[firstCategory].hasOwnProperty(secondCategory)) {
                        const newExpanded = { ...prevExpanded }
                        // If the category is already expanded, collapse it
                        delete newExpanded[firstCategory][secondCategory]
                        return newExpanded
                    } else {
                        // If the category is not expanded, expand it
                        if (allCategories[firstCategory]['subCategories'][secondCategory].hasChildren) {
                            const newExpanded = { ...prevExpanded }
                            newExpanded[firstCategory][secondCategory] = {}
                            return newExpanded
                        }
                    }
                }
                return prevExpanded
            })

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

    // fetch the fourth category
    const getFourthCategory = async (firstCategory, secondCategory, thirdCategory) => {
        // console.log(firstCategory, secondCategory, thirdCategory)
        var url = `https://localhost:7219/api/categories/first_category/${firstCategory}/second_category/${secondCategory}/third_category/${thirdCategory}`
        try {
            const response = await axios.get(url)
            // console.log(response.data)
            setAllCategories((prevData) => {
                const newExpanded = { ...prevData }
                newExpanded
                [firstCategory]
                ['subCategories']
                [secondCategory]
                ['subCategories']
                [thirdCategory]
                ['subCategories'] = response.data
                return newExpanded
            })

            setExpandedCategories((prevExpanded) => {
                // console.log(prevExpanded)
                if (prevExpanded[firstCategory][secondCategory].hasOwnProperty(thirdCategory)) {
                    const newExpanded = { ...prevExpanded }
                    // If the category is already expanded, collapse it
                    delete newExpanded[firstCategory][secondCategory][thirdCategory]
                    return newExpanded
                } else {
                    // If the category is not expanded, expand it
                    if (allCategories[firstCategory]['subCategories'][secondCategory]['subCategories'][thirdCategory].hasChildren) {
                        const newExpanded = { ...prevExpanded }
                        newExpanded[firstCategory][secondCategory][thirdCategory] = {}
                        return newExpanded
                    }
                }

                return prevExpanded
            })

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

    // fetch the last articles under the fourth category
    const getLastArticles = (firstCategory, secondCategory, thirdCategory, fourthCategory, fourthCategoryValue) => {
        setExpandedCategories((prevExpanded) => {
            // console.log(prevExpanded)
            if (prevExpanded[firstCategory][secondCategory][thirdCategory].hasOwnProperty(fourthCategory)) {
                const newExpanded = { ...prevExpanded }
                // If the category is already expanded, collapse it
                delete newExpanded[firstCategory][secondCategory][thirdCategory][fourthCategory]
                return newExpanded
            } else {
                // If the category is not expanded, expand it
                if (fourthCategoryValue.hasChildren) {
                    const newExpanded = { ...prevExpanded }
                    newExpanded[firstCategory][secondCategory][thirdCategory][fourthCategory] = {}
                    return newExpanded
                }
            }

            return prevExpanded
        })
    }

    const collapseAll = () => {
        setExpandedCategories({})
    }

    return (
        <div className="nav-bar">
            {/* navigation title */}
            <div className="nav-bar__name" onClick={() => collapseAll()}>
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
                            <div className="nav-bar__category_div">
                                {/* left part of <li>: arrow -> folder -> category name */}

                                {/* when user clicks the level 1 category, requests server to get the respective level 2 categories*/}
                                <div className="nav-bar__category_name"
                                    onClick={() => getSecondCategory(firstCategoryName)}>

                                    {/* the arrow icon */}
                                    {/* if the level 1 category doesn't have children, hide the arrow */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        className={
                                            classNames(
                                                { hideFileArrow: !firstCategoryValue.hasChildren },
                                                { imgRotate: expandedCategories.hasOwnProperty(firstCategoryName) }
                                            )
                                        }>
                                        <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" /></svg>


                                    {/* if the level has been clicked, then the folder icon become a opened folder icon */}
                                    {expandedCategories.hasOwnProperty(firstCategoryName) && firstCategoryValue.hasChildren ?
                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__folder-icon'><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg>
                                        ) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__folder-icon'><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>
                                        )
                                    }

                                    {/* the level 1 category name */}
                                    <span>{firstCategoryName}</span>

                                </div>

                                {/* add folder and add file image */}
                                <div className={classNames("nav-bar__category_img")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__add-folder'>
                                        <title>create a folder</title>
                                        <path d="M512 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l128 0c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8l160 0c35.3 0 64 28.7 64 64l0 256zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z" /></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__add-file'>
                                        <title>create a file</title>
                                        <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z" /></svg>
                                </div>

                            </div>

                            {/* second category */}
                            <ul className={classNames("nav-bar__second-category", { "expanded": expandedCategories.hasOwnProperty(firstCategoryName) })}
                            >

                                {/* if the parent category has been clicked, show all children categories */}
                                {expandedCategories.hasOwnProperty(firstCategoryName) && (

                                    // secondCategoryValue: {hasChildren:true, subCategories:null, articles:null}
                                    Object.entries(firstCategoryValue["subCategories"]).map(([secondCategoryName, secondCategoryValue], secondIndex) => (
                                        <li className={classNames("nav-bar__second-category-items")}
                                            key={secondIndex}>
                                            {/* level 2 category <li> content */}

                                            {/* left part of <li>: arrow -> folder icon -> category name OR file icon -> filename */}
                                            {/* when user clicks the level 2 category, requests server to get the respective level 3 categories*/}

                                            <div className="nav-bar__category_div">
                                                <div
                                                    className="nav-bar__category_name"
                                                    onClick={() => getThirdCategory(firstCategoryName, secondCategoryName)}>

                                                    {/* show the arrow or not */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                        className={
                                                            classNames(
                                                                { hideFileArrow: !secondCategoryValue.hasChildren },
                                                                { imgRotate: expandedCategories[firstCategoryName].hasOwnProperty(secondCategoryName) }
                                                            )
                                                        }>
                                                        <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" /></svg>


                                                    {/* the folder icon */}
                                                    {/* if the level has been clicked, then the folder icon become a opened folder icon */}
                                                    {expandedCategories[firstCategoryName].hasOwnProperty(secondCategoryName) && secondCategoryValue.hasChildren ?
                                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__folder-icon'><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg>
                                                        ) :
                                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__folder-icon'><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>
                                                        )
                                                    }

                                                    {/* level 2 category name */}
                                                    <span>{secondCategoryName}</span>

                                                </div>
                                                {/* add folder and add image icon */}
                                                <div className={classNames("nav-bar__category_img")}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__add-folder'>
                                                        <title>create a folder</title>
                                                        <path d="M512 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l128 0c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8l160 0c35.3 0 64 28.7 64 64l0 256zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z" /></svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__add-file'>
                                                        <title>create a file</title>
                                                        <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z" /></svg>
                                                </div>

                                            </div>

                                            {/* third category */}
                                            <ul className={classNames("nav-bar__third-category", { "expanded": expandedCategories[firstCategoryName].hasOwnProperty(secondCategoryName) })}>

                                                {/* if the parent category has been clicked, show all children categories */}
                                                {expandedCategories[firstCategoryName].hasOwnProperty(secondCategoryName) && (

                                                    // thirdCategoryValue: {hasChildren:true, subCategories:null, articles:null}
                                                    Object.entries(secondCategoryValue["subCategories"]).map(([thirdCategoryName, thirdCategoryValue], thirdIndex) => (
                                                        <li className={classNames("nav-bar__third-category-items")}
                                                            key={thirdIndex}>
                                                            {/* level 3 category <li> content */}

                                                            {/* left part of <li>: arrow -> folder icon -> category name OR file icon -> filename */}
                                                            {/* when user clicks the level 3 category, requests server to get the respective level 4 categories*/}

                                                            <div className="nav-bar__category_div">
                                                                <div
                                                                    className="nav-bar__category_name"
                                                                    onClick={() => getFourthCategory(firstCategoryName, secondCategoryName, thirdCategoryName)}>

                                                                    {/* show the arrow or not */}
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 448 512"
                                                                        className={
                                                                            classNames(
                                                                                { hideFileArrow: !thirdCategoryValue.hasChildren },
                                                                                { imgRotate: expandedCategories[firstCategoryName][secondCategoryName].hasOwnProperty(thirdCategoryName) }
                                                                            )
                                                                        }>
                                                                        <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" /></svg>


                                                                    {/* the folder icon */}
                                                                    {/* if the level has been clicked, then the folder icon become a opened folder icon */}
                                                                    {expandedCategories[firstCategoryName][secondCategoryName].hasOwnProperty(thirdCategoryName) && thirdCategoryValue.hasChildren ?
                                                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__folder-icon'><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg>
                                                                        ) :
                                                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__folder-icon'><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>
                                                                        )
                                                                    }

                                                                    {/* level 3 category name */}
                                                                    <span>{thirdCategoryName}</span>

                                                                </div>
                                                                {/* add folder and add image icon */}
                                                                <div className={classNames("nav-bar__category_img")}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__add-folder'>
                                                                        <title>create a folder</title>
                                                                        <path d="M512 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l128 0c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8l160 0c35.3 0 64 28.7 64 64l0 256zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z" /></svg>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__add-file'>
                                                                        <title>create a file</title>
                                                                        <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z" /></svg>
                                                                </div>

                                                            </div>

                                                            {/* fourth category */}
                                                            <ul
                                                                className={
                                                                    classNames(
                                                                        "nav-bar__fourth-category",
                                                                        { "expanded": expandedCategories[firstCategoryName][secondCategoryName].hasOwnProperty(thirdCategoryName) }
                                                                    )
                                                                }>

                                                                {/* if the parent category has been clicked, show all children categories */}
                                                                {expandedCategories[firstCategoryName][secondCategoryName].hasOwnProperty(thirdCategoryName) && (

                                                                    // fourthCategoryValue: {hasChildren:true, subCategories:null, articles:null}
                                                                    Object.entries(thirdCategoryValue["subCategories"]).map(([fourthCategoryName, fourthCategoryValue], fourthIndex) => (
                                                                        <li className={classNames("nav-bar__fourth-category-items")}
                                                                            key={fourthIndex}>
                                                                            {/* level 4 category <li> content */}

                                                                            {/* left part of <li>: arrow -> folder icon -> category name OR file icon -> filename */}
                                                                            {/* when user clicks the level 4 category, requests server to get the respective articles under level 4*/}

                                                                            <div className="nav-bar__category_div">
                                                                                <div
                                                                                    className="nav-bar__category_name"
                                                                                    onClick={() => getLastArticles(firstCategoryName, secondCategoryName, thirdCategoryName, fourthCategoryName, fourthCategoryValue)}
                                                                                >

                                                                                    {/* show the arrow or not */}
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        viewBox="0 0 448 512"
                                                                                        className={
                                                                                            classNames(
                                                                                                { hideFileArrow: !fourthCategoryValue.hasChildren },
                                                                                                { imgRotate: expandedCategories[firstCategoryName][secondCategoryName][thirdCategoryName].hasOwnProperty(fourthCategoryName) }
                                                                                            )
                                                                                        }>
                                                                                        <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" /></svg>


                                                                                    {/* the folder icon */}
                                                                                    {/* if the level has been clicked, then the folder icon become a opened folder icon */}
                                                                                    {expandedCategories[firstCategoryName][secondCategoryName][thirdCategoryName].hasOwnProperty(fourthCategoryName) && fourthCategoryValue.hasChildren ?
                                                                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__folder-icon'><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg>
                                                                                        ) :
                                                                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__folder-icon'><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>
                                                                                        )
                                                                                    }

                                                                                    {/* level 4 category name */}
                                                                                    <span>{fourthCategoryName}</span>

                                                                                </div>
                                                                                {/* add folder and add image icon */}
                                                                                <div className={classNames("nav-bar__category_img")}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__add-folder'>
                                                                                        <title>create a folder</title>
                                                                                        <path d="M512 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l128 0c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8l160 0c35.3 0 64 28.7 64 64l0 256zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z" /></svg>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__add-file'>
                                                                                        <title>create a file</title>
                                                                                        <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z" /></svg>
                                                                                </div>

                                                                            </div>

                                                                            {/* Articles under level 4 category */}
                                                                            <ul
                                                                                className={
                                                                                    classNames(
                                                                                        "nav-bar__fourth-category",
                                                                                        { "expanded": expandedCategories[firstCategoryName][secondCategoryName][thirdCategoryName].hasOwnProperty(fourthCategoryName) }
                                                                                    )
                                                                                }>

                                                                                <div className={
                                                                                    classNames(
                                                                                        { 'nav-bar__category_article': expandedCategories[firstCategoryName][secondCategoryName][thirdCategoryName].hasOwnProperty(fourthCategoryName) }
                                                                                    )
                                                                                }>

                                                                                    {/* fourthCategoryValue['articles']: {articleId: articleTitle} */}
                                                                                    {expandedCategories[firstCategoryName][secondCategoryName][thirdCategoryName].hasOwnProperty(fourthCategoryName) &&
                                                                                        fourthCategoryValue['articles'] !== null &&
                                                                                        (
                                                                                            Object.entries(fourthCategoryValue['articles']).map(([id, title]) => (

                                                                                                <li className={classNames("nav-bar__fourth-category-items")}
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

                                                                                        )}
                                                                                </div>
                                                                            </ul>

                                                                        </li>
                                                                    ))

                                                                )}

                                                                {/* Articles under level 3 category */}
                                                                <div className={
                                                                    classNames(
                                                                        { 'nav-bar__category_article': expandedCategories[firstCategoryName][secondCategoryName].hasOwnProperty(thirdCategoryName) }
                                                                    )
                                                                }>

                                                                    {/* thirdCategoryValue['articles']: {articleId: articleTitle} */}
                                                                    {expandedCategories[firstCategoryName][secondCategoryName].hasOwnProperty(thirdCategoryName) &&
                                                                        thirdCategoryValue['articles'] !== null &&
                                                                        (
                                                                            Object.entries(thirdCategoryValue['articles']).map(([id, title]) => (

                                                                                <li className={classNames("nav-bar__fourth-category-items")}
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

                                                                        )}
                                                                </div>
                                                            </ul>

                                                        </li>
                                                    ))

                                                )}

                                                {/* Articles under level 2 category */}
                                                <div className={classNames({ 'nav-bar__category_article': expandedCategories[firstCategoryName].hasOwnProperty(secondCategoryName) })}>

                                                    {/* secondCategoryValue['articles']: {articleId: articleTitle} */}
                                                    {expandedCategories[firstCategoryName].hasOwnProperty(secondCategoryName) &&
                                                        secondCategoryValue['articles'] !== null &&
                                                        (
                                                            Object.entries(secondCategoryValue['articles']).map(([id, title]) => (

                                                                <li className={classNames("nav-bar__third-category-items")}
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

                                                        )}
                                                </div>
                                            </ul>


                                        </li>
                                    ))

                                )}

                                {/* Articles under level 1 category */}
                                <div className={classNames({ 'nav-bar__category_article': expandedCategories.hasOwnProperty(firstCategoryName) })}>

                                    {/* firstCategoryValue['articles']: {articleId: articleTitle} */}
                                    {expandedCategories.hasOwnProperty(firstCategoryName) &&
                                        firstCategoryValue['articles'] !== null &&
                                        (
                                            Object.entries(firstCategoryValue['articles']).map(([id, title]) => (

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

                                        )}
                                </div>
                            </ul>


                        </li>
                    ))}

                </ul>

            </div>
        </div>
    )
}


export default NavBar