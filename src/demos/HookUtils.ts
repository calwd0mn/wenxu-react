import { useEffect, useState } from 'react'
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [])
}
export function useMousePosition() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    function updateMousePosition(e: MouseEvent) {
      setX(e.clientX)
      setY(e.clientY)
    }

    document.addEventListener('mousemove', updateMousePosition)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return {
    x,
    y
  }
}

function getInfo(): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Date.now().toString())
    }, 1500)
  })
}
export function useGetInfo() {
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<string | null>(null)
  useEffect(() => {
    getInfo().then(info => {
      setLoading(false)
      setUserInfo(info)
    })
  }, [])
  return {
    loading,
    userInfo
  }
}
