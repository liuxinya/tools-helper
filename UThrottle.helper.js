
// 基于时间缓冲操作 防止函数短时间内执行很多次 多少秒之后执行
class Throttle {
    constructor() {
        this.firTime = null;
        this.secTime = null;
        this.flag = {
            passF: true,
            noPassF: true
        }; // 不让外界直接调起oper函数 因为要节流 必须通过节流的时间段
        this.timer = null;
        this.rate = 200;
    }
    // 这是多长时间内不可操作的节流  间隔后的操作需要手动触发
    throttleTime(rate) {
        if (rate) this.rate = rate;
        if (!this.firTime) {
            this.firTime = Date.now() - this.rate;
            this.flag.noPassF = false;
        } else {
            this.flag.noPassF = true;
        }
        this.secTime = Date.now();
        this.flag.passF = false;
        if (this.secTime - this.firTime >= this.rate) {
            this.flag.passF = true;
            this.flag.noPassF = false;
            this.firTime = this.secTime;
        }
        return this;
    }
    passOper(fn) {
        fn && this.flag.passF && fn();
        return this;
    }
    noPassOper(fn) {
        fn && this.flag.noPassF && fn(this.secTime - this.firTime);
        return this;
    }
}

let UThrottle = new Throttle();

export { UThrottle }