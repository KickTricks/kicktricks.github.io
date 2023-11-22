export const url = {
  searchParams: new URLSearchParams(window.location.search),
  getParams: (params) => {
    if(typeof params === 'string') {
      return url.searchParams.get(params)
    } else if (typeof params === 'object') {
      const result = []
      params.forEach(param => {
        result.push(url.searchParams.get(param))
      })
      return result
    }
  },
  getIntParams: (params) => {
    if(typeof params === 'string') {
      return Number.parseInt(url.searchParams.get(params), 10)
    } else if (typeof params === 'object') {
      const result = []
      params.forEach(param => {
        result.push(Number.parseInt(url.searchParams.get(param), 10))
      })
      return result
    }
  },
  getFloatParams: (params) => {
    if(typeof params === 'string') {
      return Number.parseFloat(url.searchParams.get(params))
    } else if (typeof params === 'object') {
      const result = []
      params.forEach(param => {
        result.push(Number.parseFloat(url.searchParams.get(param)))
      })
      return result
    }
  },
  getBoolParams: (params) => {
    if(typeof params === 'string') {
      return url.searchParams.get(params) === 'true'
    } else if (typeof params === 'object') {
      const result = []
      params.forEach(param => {
        result.push(url.searchParams.get(param) === 'true')
      })
      return result
    }
  }
}