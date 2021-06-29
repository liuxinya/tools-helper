export async function fileToDataUrl(file: File): Promise<string> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
    });
}


export function dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = (/:(.*?);/.exec(arr[0]))[1];
    const bstr = atob(arr[1]); // 全局变量的属性atob，解码base64编码
    let n = bstr.length;
    const u8arr = new Uint8Array(n);// 创建一个8位无符号整型数组,数组项取值范围是0～255（二进制8位最大值11111111=>255）
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime,
    });
}

export function blobtoFile(blob: Blob, filename: string, type: string) {
    return new File([blob], filename, {type});
}

export function changeBlobImageQuality(blob: Blob, format?: string, quality?: number): Promise<Blob> {
    return new Promise(resolve => {
        format = format || 'image/jpeg';
        quality = quality || 0.9;
        const fr = new FileReader();
        fr.onload = e => {
            const dataUrl = e.target.result;
            const img = new Image();
            img.onload = () => {
                let canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const newDataUrl = canvas.toDataURL(format, quality);
                resolve(dataURLtoBlob(newDataUrl));
                canvas = null;
            };
            img.src = dataUrl as any;
        };
        fr.readAsDataURL(blob);
    });
}
