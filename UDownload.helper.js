function open(url) {
    window.open(url, '_blank')
}

function blob(data, fileName) {
    //  注意 请求类型 一定要改成 responseType: 'blob'
    let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
    if (typeof window.chrome !== 'undefined') {
        // Chrome version
        let a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob)
        a.click()
    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE version
        let blob = new Blob([data], { type: 'application/force-download' });
        window.navigator.msSaveBlob(blob, fileName);
    } else {
        // Firefox version
        let file = new File([data], fileName, { type: 'application/force-download' });
        window.open(URL.createObjectURL(file));
    }
}

export const UDownloadHelper = {
    open,
    blob
}