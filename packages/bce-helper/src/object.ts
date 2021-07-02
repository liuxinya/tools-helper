
export function mergeObj<T extends object, K extends object>(obj1: T, obj2: K): T & K {
    let res: {[props: string]: string} = {};
    Object.keys(obj1).forEach(item => {
        res[item] = (obj1 as any)[item];
    });
    Object.keys(obj2).forEach(item => {
        res[item] = (obj2 as any)[item];
    });
    return res as any;
}
