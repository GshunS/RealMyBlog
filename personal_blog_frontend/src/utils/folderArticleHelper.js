export const clearTempElements = (classname) => {
    const children = document.querySelectorAll(classname)
    children.forEach(child => {
        child.style.display = "none"
        let inputEle = child.querySelector('input')
        if (inputEle) {
            inputEle.value = ''
        }
    })
}