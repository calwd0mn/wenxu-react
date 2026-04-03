import { Flex, Button, Space, Typography, Tooltip, message, Popover } from 'antd'
import React from 'react'
import { LeftOutlined, CopyOutlined, QrcodeOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import useGetPageInfo from '../../hooks/useGetPageInfo'
import style from './Stat.module.scss'
import { QRCodeSVG } from 'qrcode.react'

export default function StatHeader() {
  const nav = useNavigate()
  const { title } = useGetPageInfo()
  const { id } = useParams()

  function getCopyUrl() {
    return `http://localhost:8001/question/${id}`
  }

  function copyUrl() {
    navigator.clipboard.writeText(getCopyUrl())
    message.success('复制成功')
  }

  function goEditPage() {
    nav(`/question/edit/${id}`)
  }

  const urlQrCode = () => {
    return <QRCodeSVG value={getCopyUrl()} />
  }

  return (
    <Flex align="center" justify="space-between" style={{ height: '100%', position: 'relative' }}>
      <Space>
        <Button type="link" icon={<LeftOutlined />} onClick={() => nav(-1)}>
          返回
        </Button>
        <Typography.Text strong>{title}</Typography.Text>
      </Space>
      <Space style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <div className={style.urlBorder}>
          <div>{getCopyUrl()}</div>
        </div>
        <div className={style.iconBorder}>
          <Tooltip title="拷贝">
            <CopyOutlined onClick={copyUrl} />
          </Tooltip>
        </div>
        <Popover placement="bottom" content={urlQrCode}>
          <div className={style.iconBorder}>
            <QrcodeOutlined />
          </div>
        </Popover>
      </Space>
      <Space style={{ paddingRight: '20px' }}>
        <Button type="primary" onClick={goEditPage}>
          编辑问卷
        </Button>
      </Space>
    </Flex>
  )
}
