import Mock from 'mockjs'

const domain = '/api/'

// 模拟getData接口
Mock.mock(domain + 'getData.json',{
    code: 0,
    message: 'OK',
    data: 'test'
})