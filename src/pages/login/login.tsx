/**
 * 登录
 * lechen
 */

import React, {useState, useEffect} from 'react';
import styles from './login.module.scss'
import {withRouter} from 'react-router-dom';
import {ActivityIndicator, Button, Checkbox, Toast} from 'antd-mobile';
import PubSub from "pubsub-js";
/*import User from "../../../models/plat/User";
import {Account} from "../../../models/plat/Account";
import {DoLogin} from "../../../services/plat/UserService";*/
import accountIcon from '../../static/icon/account.svg';
import passwordIcon from '../../static/icon/password.svg';
import AppLoading from '../loading/loading'

function AppLogin(props: any, ref: any) {

    //设置加载状态
    const [loading, setLoading] = useState(false);
    //设置账户
    const [account, setAccount] = useState('');
    //设置密码
    const [password, setPassword] = useState('');
    //是否记住密码
    const [isrememberPwd, setIsrememberPwd] = useState<boolean>(false);

    /**
     * 登录成功
     */
    const onFinish = (values: any) => {
        /*let account = new Account(values);
        let params = {
            userCode: account.userCode,
            passWord: account.passWord,
        }
        DoLogin(params).then((user: any) => {
            if (user) {
                const userData = new User(user);
                sessionStorage.setItem('token', JSON.stringify(userData));
                sessionStorage.setItem('userName', account.userCode);
                PubSub.publish('onLoginSuccess');
                props.history.push("/index");
            }
        })*/
    };

    /**
     * 注册事件
     */
    const registerEvent = () => {
        /*PubSub.publish('goRegister');*/
    }

    /**
     * 登录失败
     */
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    /**
     * 当账户发生改变
     */
    const accountChange = (e: any) => {
        setAccount(e.target.value);
    }

    /**
     * 当密码发生改变
     */
    const passwordChange = (e: any) => {
        setPassword(e.target.value);
    }

    /**
     * 选择了记住密码
     */
    const rememberPwd = () => {
        let value = !isrememberPwd
        setIsrememberPwd(value)
    }

    /**
     * 点击登录按钮
     */
    const loginBtn = () => {
        if (account && password) {
            let params = {
                userCode: account,
                passWord: password
            }
            setLoading(true);
            /*api.login(params).then(res => {
                if (res.code == '0') {
                    let user = {
                        userName: res.data.userName,
                        tenantName: res.data.tenantName,
                        token: res.data.token
                    }

                    //保存登录信息
                    sessionStorage.setItem('token', JSON.stringify(user));

                    //账户信息
                    let accountInf;

                    if (isrememberPwd) {
                        //加密的密码
                        let cipherPassword = crypto.AES.encrypt(password, "accountInf").toString();
                        //账户信息
                        accountInf = {
                            account: account,
                            password: cipherPassword
                        }
                    }
                    else {
                        //账户信息
                        accountInf = {
                            account: account,
                            password: ''
                        }
                    }

                    //清除本地存储
                    // localStorage.clear();
                    //保存账户密码信息
                    localStorage.setItem('accountInf', JSON.stringify(accountInf));
                    Toast.success(`欢迎回来！${res.data.userName}`, 1);
                    props.history.replace('/home');
                }
                else if (res.code == '50050202') {
                    Toast.fail('该用户不存在！', 1);
                }
                else if (res.code == '50050203') {
                    Toast.fail('用户密码错误！', 1);
                }
                setLoading(false);
            })*/
            //保存登录信息
            setLoading(false);
            sessionStorage.setItem('token', JSON.stringify({username:"admin",pass:"123"}));
            props.history.push('/index');
        } else if (!account) {
            Toast.fail('请先输入账户！', 1);
        } else if (account && !password) {
            Toast.fail('请先输入密码！', 1);
        }
    }

    return (
        <div className={styles.login}>
            <div className={styles.form_content}>
                <div className={styles.inputWrap}>
                    {/* <IconFont type="iconAccount"></IconFont> */}
                    <img src={accountIcon} alt="account"/>
                    <div className={styles.inputContent}>
                        <input
                            type={'text'}
                            placeholder={'请输入您的账户'}
                            maxLength={100}
                            value={account}
                            onChange={accountChange}
                        />
                    </div>
                </div>
                <div className={styles.inputWrap}>
                    {/* <IconFont type="iconLock"></IconFont> */}
                    <img src={passwordIcon} alt="password"/>
                    <div className={styles.inputContent}>
                        <input
                            type={'password'}
                            placeholder={'请输入您的密码'}
                            maxLength={100}
                            value={password}
                            onChange={passwordChange}
                        />
                    </div>
                </div>
                <div className={styles.rememberPwd}>
                    <Checkbox checked={isrememberPwd} onChange={rememberPwd}></Checkbox>&nbsp;记住密码
                </div>
                <div className={styles.login_btn}>
                    <Button className={styles.btn} type="primary" disabled={loading} onClick={loginBtn}
                            loading={loading}>登录</Button>
                </div>
            </div>
            <div className={styles.bg_content}>
            </div>
            <AppLoading loading={loading}/>
        </div>
    )
}

export default AppLogin;


