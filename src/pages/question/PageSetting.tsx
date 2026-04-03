import { Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { PageInfoPropsType, resertPageInfo } from '../../store/pageInfoReducer'
import useGetPageInfo from '../../hooks/useGetPageInfo'
import { useDispatch } from 'react-redux'

export default function PageSetting() {
  const [form] = Form.useForm()
  const pageInfo = useGetPageInfo()
  const dispatch = useDispatch()
  function onFormLayoutChange() {
    const formValues = form.getFieldsValue()
    dispatch(resertPageInfo(formValues))
  }

  useEffect(() => {
    form.setFieldsValue(pageInfo)
  }, [pageInfo])

  return (
    <Form
      layout={'vertical'}
      form={form}
      initialValues={pageInfo}
      onValuesChange={onFormLayoutChange}
    >
      <Form.Item<PageInfoPropsType> label="问卷标题" name="title">
        <Input placeholder="请输入问卷标题" />
      </Form.Item>

      <Form.Item<PageInfoPropsType> label="问卷描述" name="description">
        <Input.TextArea rows={4} placeholder="请输入问卷描述" />
      </Form.Item>

      <Form.Item<PageInfoPropsType> label="CSS代码" name="cssCode">
        <Input.TextArea rows={4} placeholder="请输入CSS代码" />
      </Form.Item>

      <Form.Item<PageInfoPropsType> label="JS代码" name="jsCode">
        <Input.TextArea rows={4} placeholder="请输入JS代码" />
      </Form.Item>
    </Form>
  )
}
