const storage = {
  set(key, val) {
    if (typeof key === 'string') {
      localStorage.setItem(key, JSON.stringify(val))
    } else {
      console.log('key只能是字符串类型')
    }
  },
  get(key) {
    return JSON.parse(localStorage.getItem(key))
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}

export default storage