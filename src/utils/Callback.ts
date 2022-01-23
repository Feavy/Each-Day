export default class Callback<T> extends Function {
    private listeners: ((arg: T) => void)[] = [];

    constructor() {
        super();
        const self = this;
        return new Proxy(this, {
            apply: function (target, thisArg, argumentsList: any) {
                for(const listener of self.listeners) {
                    listener(argumentsList[0]);
                }
                return;
            }
        });
    }

    public sub(listener: (arg: T) => void) {
        this.listeners.push(listener);
    }

    public unsub(listener: (arg: T) => void) {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }

    public clear() {
        this.listeners = [];        
    }
}