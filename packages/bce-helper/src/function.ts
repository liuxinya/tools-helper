
export function compose(...funs: any) {
    return (result: any) => {
        let len = funs.length - 1;
        while (len >= 0) {
            result = funs[len](result);
            len--;
        }
        return result;
    }
}

export const composePromise = function(...args: any) {
    const init = args.pop()
    return function(...arg: any) {
      return args.reverse().reduce(function(sequence: Promise<any>, func: any) {
        return sequence.then(function(result) {
          return func.call(null, result)
        })
      }, Promise.resolve(init.apply(null, arg)))
    }
}