import './NavBarElementOperations.css'
// import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { fetchNextCategory , editCurrentAncestorNames, editTempFolderCreated} from '../../../../store/modules/blogContentNavBarStore';
// import axios from 'axios'

const NavBarElementOperation = (props) => {
    const dispatch = useDispatch()
    const expandedCategories = props.expandedCategories;
    const { categoryName, categoryValue } = props.expandedCategoriesInfo;
    const categories = props.categories;
    const ancestorCategoryNames = props.ancestorCategoryNames

    const createFolder = () => {
        document.querySelectorAll('.nav-bar__category_div_temp').forEach((element) => {
            let text = element.parentElement.parentElement.parentElement.querySelector('span').innerText
            if (text === ancestorCategoryNames[0]) {
                console.log(element)
                element.style.display = 'flex'
                element.classList.add('showFolder')
            }
        })
        dispatch(editTempFolderCreated(true))
        dispatch(editCurrentAncestorNames(ancestorCategoryNames))
        if (!expandedCategories.hasOwnProperty(categoryName)) {
            dispatch(fetchNextCategory(categoryValue, ...categories))
        }

    }
    return (
        // operation for a folder
        <div className={classNames("nav-bar__category_img")}>
            {/* create a subfolder */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className={classNames('nav-bar__add-folder', {'nav-bar__hide-createFolder': categories.length === 4})}
                onClick={() => createFolder()}>
                <title>create a folder</title>

                <path d="M512 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l128 0c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8l160 0c35.3 0 64 28.7 64 64l0 256zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z" /></svg>
            {/* {create a file} */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__add-file'>
                <title>create a file</title>
                <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z" /></svg>
        </div>
    )
}

export default NavBarElementOperation