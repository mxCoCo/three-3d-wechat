const  localStorageUtil  = {
    get(key, isJson){
        let val = window.sessionStorage.getItem(key);
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
        window.sessionStorage.setItem(key,value);
    },
    clear() {
        window.sessionStorage.clear();
    },
    remove(key) {
        window.sessionStorage.removeItem(key);
    }
}

export default localStorageUtil