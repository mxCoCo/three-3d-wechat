const  localStorageUtil  = {
    get(key, isJson){
        let val = window.localStorage[key];
        if (isJson && val){
            val = JSON.parse(val)
        }
        return val;
    },
    set(key, value, isJson) {
        if (isJson && value){
            value = JSON.stringify(value)
        }
        if (typeof value == "object") {
            value = JSON.stringify(value);
        }
        window.localStorage[key] = value;
    },
    clear() {
        window.localStorage.clear();
    },
    remove(key) {
        window.localStorage.removeItem(key);
    }
}

export default localStorageUtil