import React, {Component} from 'react'
import {Modal} from 'antd'
import {withRouter} from 'react-router-dom'
import LinkButton from '../link-button'
import menuList from '../../config/menuConfig'
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
/*
头部组件
*/
class Header extends Component {
    state = {
        sysTime: formateDate(Date.now()),
        dayPictureUrl: '', // 天气图片的 url
        weather: ''
    }


    getWeather = async () => {
        const {dayPictureUrl, weather} = await reqWeather('北京')
        this.setState({
            dayPictureUrl,
            weather
        })
    }

    getSysTime = () => {
        this.intervalId = setInterval(() => {
            this.setState({
                sysTime: formateDate(Date.now())
            })
        }, 1000)
    }

    logout = () => {
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
                console.log('OK')
// 移除保存的 user
                storageUtils.removeUser()
                memoryUtils.user = {}
// 跳转到 login
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }


    getTitle = (path) => {
        let title
        menuList.forEach(menu => {
            if(menu.key===path) {
                title = menu.title
            } else if (menu.children) {
                menu.children.forEach(item => {
                    if(path.indexOf(item.key)===0) {
                        title = item.title
                    }
                })
            }
        })
        return title
    }

componentDidMount () {
    this.getSysTime()
    this.getWeather()
}
componentWillUnmount () {
// 清除定时器
    clearInterval(this.intervalId)
}

    render() {
        const {sysTime, dayPictureUrl, weather} = this.state
// 得到当前用户
        const user = memoryUtils.user
// 得到当前请求的路径
        const path = this.props.location.pathname
// 得到对应的标题
        const title = this.getTitle(path)
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{sysTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)