export default {
  // type区分来源 1.为账户状态; 2.为用户来源
  methods: {
    $userStatus2Text(status, type) {
      let statusText = ''
      if (type == 1) {
        switch (status) {
          case 0:
            statusText = '注册冻结'
            break
          case 1:
            statusText = '正常'
            break
          case 2:
            statusText = '冻结中'
            break
        }
      } else if (type == 2) {
        switch (status) {
          case 1:
            statusText = '派钱包'
            break
          case 2:
            statusText = '派克帝国'
            break
          case 3:
            statusText = '秘密'
            break
        }
      } else if (type == 3) {
        switch (status) {
          case 1:
            statusText = '未设置'
            break
          case 2:
            statusText = '开启'
            break
          case 3:
            statusText = '关闭'
            break
        }
      } else if (type == 4) {
        switch (status) {
          case 0:
            statusText = '未上传'
            break
          case 1:
            statusText = '待审核'
            break
          case 2:
            statusText = '未投放（审核通过）'
            break
          case 3:
            statusText = '投放中'
            break
          case 4:
            statusText = '投放完成（过期）'
            break
          case 5:
            statusText = '审核不通过'
            break
        }
      }
      return statusText
    },
    // 用来筛选出对应的类型
    matchType(arr, target) {
      let text
      arr.forEach((item) => {
        if (parseInt(item.id) === parseInt(target)) {
          text = item.text
        }
      })
      return text
    },
    // 时间过滤
    $changeDate(time, str = '-', type = 1) {
      if (!time) return ''

      function ifTime(value) { // 判断时间是否是个位数
        if (value < 10) {
          return '0' + value
        }
        return value
      }

      let newTime = new Date(time)
      let day = newTime.getDate()
      let month = newTime.getMonth() + 1
      let year = newTime.getFullYear()
      let hours = newTime.getHours()
      let min = newTime.getMinutes()
      let sec = newTime.getSeconds()
      switch (type) {
        case 1:
          return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
        case 2:
          return year + str + ifTime(month) + str + ifTime(day) + ' 00:00:00'
        case 3:
          return year + str + ifTime(month) + str + ifTime(day) + ' 23:59:59'
        case 4:
          return year + str + ifTime(month) + str + ifTime(day)
        case 5:
          return year + str + ifTime(month) + str + ifTime(day)
        case 6:
          return ifTime(hours) + ':' + ifTime(min)
        case 7:
          return ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
        case 8:
          return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
        case 9:
          return ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
        case 10:
          return year + str + ifTime(month) + str + ifTime(day) + '<br>' + ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
      }
    },
  },

  computed: {
    // 年月日转为时间戳
    getUnixTime(dateStr) {
      let newstr = dateStr.replace(/-/g, '/');
      let date = new Date(newstr);
      let time_str = date.getTime();
      return time_str
    }
  }
}
