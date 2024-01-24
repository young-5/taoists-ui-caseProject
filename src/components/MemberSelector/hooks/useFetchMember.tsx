import { useEffect, useState } from 'react'

interface Props {
  fetch: any
  params: any
  data: any
}

const useFetchMember = (props: Props) => {
  const { fetch, params, data } = props
  const [result, setResult] = useState()

  useEffect(() => {
    hadleFetch
  }, [params])

  const hadleFetch = () => {
    fetch(data).then((res) => {
      setResult(res)
    })
  }

  return [hadleFetch, result]
}
export default useFetchMember
