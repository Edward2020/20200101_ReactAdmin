import React,{Component} from 'react'
import { Form, Input, Button,message } from 'antd';
import {Redirect} from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from './images/logo.png'
import './login.less'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from "../../utils/storageUtils";
import {reqLogin} from '../../api'

const Item = Form.Item

class Login extends Component{

    render() {

        // 如果用户已经登陆, 自动跳转到管理界面
        const user = memoryUtils.user
        console.log(user)
        if(user && user._id) {
            return <Redirect to='/'/>
        }


        const validator = (rule, value, callback) => {
// console.log(rule, value)
            const length = value && value.length
            const pwdReg = /^[a-zA-Z0-9_]+$/
            if (!value) {
// callback 如果不传参代表校验成功， 如果传参代表校验失败， 并且会提示错误
                callback('必须输入密码')
            } else if (length < 4) {
                callback('密码必须大于 4 位')
            } else if (length > 12) {
                callback('密码必须小于 12 位')
            } else if (!pwdReg.test(value)) {
                callback('密码必须是英文、 数组或下划线组成')
            } else {
                callback() // 必须调用 callback
            }
        }




        const onFinish = async (values) => {

            const {username, password} = values;
            console.log("============"+username);
            console.log('发送登陆的 ajax 请求', username, password)
            const result = await reqLogin(username, password)
             console.log('login()', result)
            if(result.status === 0) {
// 提示登录成功
                message.success('登录成功', 2)
// 保存用户登录信息
                const user = result.data
                storageUtils.saveUser(user)
                memoryUtils.user = user
// 跳转到主页面
                this.props.history.replace('/')
            } else {
// 登录失败, 提示错误
                message.error(result.msg)
            }
            console.log('login()', result)
        };

        return (

            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo"/>
                    <h1>React 项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h3>用户登陆</h3>
                    <Form className="login-form" onFinish={onFinish}>
                        <Item
                            name="username"
                            rules={[
                                {required: true, whitespace: true, message: '必须输入用户名'},
                                {min: 4, message: '用户名必须大于 4 位'},
                                {max: 12, message: '用户名必须小于 12 位'},
                                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、 数组或下划线组成'}
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名"/>
                        </Item>
                        <Item
                            name="password"
                            rules={[
                                {validator: validator}
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="密码"
                            />
                        </Item>


                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        );
    };
};

export default Login;