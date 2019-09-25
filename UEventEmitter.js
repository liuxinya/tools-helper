class EventEmitter {
    constructor() {
        this.events = []
    }
    once(eventname, handler) {
       this.addEvent(eventname, handler, true);
       return this;
    }
    on(eventname, handler) {
        this.addEvent(eventname, handler, false);
        return this;
    }
    addEvent(eventname, handler, once) {
        if (typeof eventname === 'function') {
            once = handler;
            handler = eventname;
            eventname = 'default';
        }
        if (!this.events[eventname]) {
            this.events[eventname] = [];
        }
        this.events[eventname].push({
            handler,
            once
        });
    }
    destroy() {
        for (let i in this.events) {
            let events = this.events[i];
            events.forEach(event => {
                delete event.handler;
                delete event.once;
            });
            delete this.events[i];
        }
    }
    emit(eventname, ...data) {
        if (this.events[eventname]) {
            // 存在这个处理
            for (let i in this.events[eventname]) {
                let item = this.events[eventname][i];
                item.handler.apply(null, data);
            }
            this.events[eventname] = this.events[eventname].filter(item => {
                let isOnce = item.once;
                if (isOnce) {
                    delete item.handler;
                    delete item.once;
                }
                return !isOnce;
            })
        }
        return this;
    }
}

let UEventEmitter = new EventEmitter();

export { UEventEmitter }