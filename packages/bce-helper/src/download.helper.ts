/* eslint-disable no-negated-condition */
/* eslint-disable dot-notation */

export function downloadFileByFrontend(data: BlobPart, fileName: string) {
    //  注意 请求类型 一定要改成 responseType: 'blob'
    const blob = new Blob([data], {type: 'application/vnd.ms-excel'});
    // @ts-ignore
    if (typeof window['chrome'] !== 'undefined') {
        // Chrome version
        const a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.click();
    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE version
        const blob = new Blob([data], {type: 'application/force-download'});
        window.navigator.msSaveBlob(blob, fileName);
    } else {
        // Firefox version
        const file = new File([data], fileName, {type: 'application/force-download'});
        window.open(URL.createObjectURL(file));
    }
}
