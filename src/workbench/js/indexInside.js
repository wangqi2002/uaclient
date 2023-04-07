/**
 * 使用span标签包裹内容，然后计算span的宽度 width： px
 * @param valArr
 */
function getTextWidth(str) {
    let width = 0
    const html = document.createElement('span')
    html.innerText = str
    html.className = 'getTextWidth'
    document.querySelector('body').appendChild(html)
    width = document.querySelector('.getTextWidth').offsetWidth
    document.querySelector('.getTextWidth').remove()
    return width
}
/**
 * 遍历列的所有内容，获取最宽一列的宽度
 * @param arr
 */
function getMaxLength(arr) {
    return arr.reduce((acc, item) => {
        if (item) {
            const calcLen = getTextWidth(item)
            if (acc < calcLen) {
                acc = calcLen
            }
        }
        return acc
    }, 0)
}