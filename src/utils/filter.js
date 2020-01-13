let dateFormat = (dataStr, format) => {
  let date = parseInt(dataStr)
  let time = new Date(date)

  //小于10在前面补0
  function padZero(val) {
    val = val < 10 ? "0" + val : val;
    return val
  }

  let y = time.getFullYear();
  let m = padZero(time.getMonth() + 1);
  let d = padZero(time.getDate());
  let h = padZero(time.getHours());
  let min = padZero(time.getMinutes());
  let s = padZero(time.getSeconds());
  if (format === 'Y-M-D') {
    return `${y}-${m}-${d}`
  }
  if (format === 'Y-M-D H:M') {
    return `${y}-${m}-${d} ${h}:${min}`
  }
  if (format === 'Y-M-D H:M:S') {
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  }
}

let moneyFormat = (value) => {
  //str  规定 货币类型
  if (!value) return '0.00';
  value = value.toFixed(2);//提前保留两位小数
  let intPart = Number(value).toFixed(0); // 获取整数部分
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断 ？？？
  let floatPart = '.00'; // 预定义小数部分
  value = value.toString();//将number类型转为字符串类型，方便操作
  let value2Array = value.split('.');
  if (value2Array.length === 2) { // =2表示数据有小数位
    floatPart = value2Array[1].toString(); // 拿到小数部分
    if (floatPart.length === 1) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart + '0';
    } else {
      return intPartFormat + '.' + floatPart;
    }
  } else {
    return intPartFormat + floatPart;
  }
}

export default {
  dateFormat,
  moneyFormat
}