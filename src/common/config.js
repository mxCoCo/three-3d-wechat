let env = process.env.REACT_APP_ENV;
console.log('env', env)
console.log('process.env', process.env)
let baseUrl = '';

//开发环境
if (env === 'development') {
    baseUrl = 'http://localhost:8001'
}
//测试环境
else if (env === 'test') {
    /* baseUrl = ''*/
}
//生产环境（未定）
else if (env === 'production') {
    baseUrl = ''
}


export const BASE_URL = baseUrl;