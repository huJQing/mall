//数组对象去重
export const uniqObjInArray = (objarray) => {
  let len = objarray.length;
  let tempJson = {};
  let res = [];
  for (let i = 0; i < len; i++) {
    //取出每一个对象
    tempJson[JSON.stringify(objarray[i])] = true;
  }
  let keyItems = Object.keys(tempJson);
  for (let j = 0; j < keyItems.length; j++) {
    res.push(JSON.parse(keyItems[j]));
  }
  return res
}