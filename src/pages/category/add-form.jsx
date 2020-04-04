import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {

  Select,
  Input
} from 'antd'
import { Form } from '@ant-design/compatible';

const Item = Form.Item
const Option = Select.Option

/*
添加分类的form组件
 */

class AddForm extends Component {


  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
    console.log(this.props.setForm)
  }



  render() {

    const {categorys, parentId} = this.props
    const { getFieldDecorator } = this.props.form

    return (
        <Form>

            <Item label='所属分类'>
              {
                getFieldDecorator('parentId', {
                  initialValue: parentId
                })(
                    <Select>
                      <Option key='0' value='0'>一级分类</Option>
                      {
                        categorys.map(c => <Option key={c._id}
                                                   value={c._id}>{c.name}</Option>)
                      }
                    </Select>
                )
              }
            </Item>

          <Item label="节点名称">
            {
              getFieldDecorator('categoryName', {
                initialValue: '',
                rules: [
                  {required: true, message: '分类名称必须输入'}
                ]
              })(
                  <Input placeholder='请输入分类名称'/>
              )
            }
          </Item>
        </Form>
    )
  }
}


export default Form.create()(AddForm)