function dragVertical(box, left, mid, right, resize, resize2) {
    var box = document.getElementsByClassName(box);
    var left = document.getElementsByClassName(left);
    var mid = document.getElementsByClassName(mid);
    var right = document.getElementsByClassName(right);
    var resize = document.getElementsByClassName(resize);
    var resize2 = document.getElementsByClassName(resize2);
    resize[0].onmousedown = function (e) {
        var startX = e.clientX;
        resize[0].left = resize[0].offsetLeft;
        document.onmousemove = function (e) {
            var endX = e.clientX;
            var rightW = right[0].offsetWidth;
            var moveLen = resize[0].left + (endX - startX);
            var maxT = box[0].clientWidth - resize[0].offsetWidth;

            resize[0].style.left = moveLen;

            for (let j = 0; j < left.length; j++) {
                left[j].style.width = moveLen + 'px';
                mid[j].style.width = (box[0].clientWidth - moveLen - rightW - 10) +
                    'px';
            }
        }
        document.onmouseup = function (evt) {
            document.onmousemove = null;
            document.onmouseup = null;
            resize[0].releaseCapture && resize[0].releaseCapture();
        }
        resize[0].setCapture && resize[0].setCapture();
        return false;
    }
    resize2[0].onmousedown = function (e) {
        var startX = e.clientX;
        resize2[0].left = resize2[0].offsetLeft;
        document.onmousemove = function (e) {
            var endX = e.clientX;
            var leftW = left[0].offsetWidth;
            var moveLen = resize2[0].left + (endX - startX) - leftW;
            var maxT = box[0].clientWidth - resize2[0].offsetWidth - 5;

            resize2[0].style.left = moveLen;
            for (let j = 0; j < right.length; j++) {
                mid[j].style.width = moveLen + 'px';
                right[j].style.width = (box[0].clientWidth - moveLen - leftW - 10) +
                    'px';
            }
        }
        document.onmouseup = function (evt) {
            document.onmousemove = null;
            document.onmouseup = null;
            resize2[0].releaseCapture && resize2[0].releaseCapture();
        }
        resize2[0].setCapture && resize2[0].setCapture();
        return false;
    }
}

function dragLevel(box, top, bottom, resize) {
    var box = document.getElementsByClassName(box);
    var top = document.getElementsByClassName(top);
    var bottom = document.getElementsByClassName(bottom);
    var resize = document.getElementsByClassName(resize);

    resize[0].onmousedown = function (e) {
        var startY = e.clientY;
        resize[0].top = resize[0].offsetTop;
        document.onmousemove = function (e) {
            var endY = e.clientY;
            var topH = top[0].offsetHeight;
            var moveLen = resize[0].top + (endY - startY);
            var maxT = box[0].clientHeight - resize[0].offsetHeight;

            resize[0].style.top = moveLen;

            top[0].style.height = moveLen + 'px';
            bottom[0].style.height = (box[0].clientHeight - moveLen - 5) + 'px';
        }
        document.onmouseup = function (evt) {
            document.onmousemove = null;
            document.onmouseup = null;
            resize[0].releaseCapture && resize[0].releaseCapture();
        }
        resize[0].setCapture && resize[0].setCapture();
        return false;
    }
}
