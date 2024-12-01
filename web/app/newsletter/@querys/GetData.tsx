import { Global } from '@/helper/Global'

export async function getServerSideProps (url: string) {
  try {
    const res = await fetch(`${Global.url}/${url}`, { cache: 'no-store' })
    if (!res.ok) {
      return []
    }
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return []
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}
