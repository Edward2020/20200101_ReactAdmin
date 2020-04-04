import React, {Component} from "react";
import {
    Card,
    Table,
    Button,
    message,
    Modal
} from 'antd'
import {Icon} from '@ant-design/compatible';
import AddForm from './add-form'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddCategory, reqUpdateCategory} from "../../api";
import UpdateForm from './update-form'



export default class Category extends Component {
    state = {
        categorys: [], // 一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 父分类的 ID
        parentName: '', // 父分类的名称
        loading: false, // 标识是否正在加载中
        showStatus: 0, // 是否显示对话框 0: 都不显示, 1: 显示添加, 2: 显示更新
    }



    getCategorys = async (parentId) => {
      // 更新 loading 状态: 加载中
        this.setState({
            loading: true
        })
    // 优先使用指定的 parentId, 如果没有指定使用状态中的 parentId
        parentId = parentId || this.state.parentId
     // 异步获取分类列表
        const result = await reqCategorys(parentId) // {status: 0, data: []}
     // 更新 loading 状态: 加载完成
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
      // 更新一级分类列表
                this.setState({
                    categorys
                })
            } else {
        // 更新二级分类列表
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
       // 获取列表失败
            message.error('获取列表失败')
        }
    }

    showSubCates = (category) => {
    // console.log('set 之前', this.state.parentId) // 0
// 更新状态: state 中的数据是异步更新(不会立即更新 state 中的数据)
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 在状态更新之后执行, 在回调函数中能得到最新的状态数据
            this.getCategorys()
        })
// console.log('set 之后', this.state.parentId) // xxx
    }

    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
            showStatus: 0,
        })
    }

    showAdd = () => {

        this.setState({
            showStatus: 1
        })
    }

    showUpdate = (category) => {
// 保存 category
        this.category = category
// 更新状态
        this.setState({
            showStatus: 2
        })
    }

    addCategory = async () => {
// 得到数据

        const {parentId, categoryName} = this.form.getFieldsValue()
        console.log(parentId)
// 关闭对话框
        this.setState({
            showStatus: 0
        })
// 重置表单
        this.form.resetFields()
// 异步请求添加分类
        const result = await reqAddCategory(parentId,categoryName )
        if (result.status === 0) {
            /*
            添加一级分类
            在当前分类列表下添加
            */
            if (parentId === this.state.parentId) {
                this.getCategorys()
            } else if (parentId === '0') {
                this.getCategorys(parentId)
            }
        }
    }

    updateCategory = async () => {
// 得到数据
        const categoryId = this.category._id
        const {categoryName} = this.form.getFieldsValue()
        
// 关闭对话框
        this.setState({
            showStatus: 0
        })
// 重置表单
        this.form.resetFields()
// 异步请求更新分类
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status === 0) {
// 重新获取列表
            this.getCategorys()
        }
    }

    componentWillMount() {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                  <LinkButton
                      onClick={() => this.showUpdate(category)}>修改分类</LinkButton>&nbsp;&nbsp;&nbsp;{this.state.parentId === '0' ?
                        <LinkButton onClick={() => this.showSubCates(category)}>查看子分类</LinkButton> : null}</span>)
            }];
    }

    componentDidMount() {
         this.getCategorys()
    }


    render() {

        // 从状态中取数据
        const {categorys, subCategorys, parentId, parentName, loading, showStatus} = this.state
// 从组件对象中数据
        const category = this.category || {}
// Card 的左侧标题
        const title = parentId === '0' ? '一级分类列表' : (<span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton> &nbsp;&nbsp;
                <Icon type='arrow-right'/>&nbsp;&nbsp;
                <span>{parentName}</span></span>)

        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'/> 添加
            </Button>
        )



        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    loading={loading}
                    pagination={{pageSize: 10, showQuickJumper: true, showSizeChanger: true}}
                />

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={() => this.setState({showStatus: 0})}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={() => {
                        this.setState({showStatus: 0})
                        this.form.resetFields()
                    }}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
            </Card>
        )
    }
}