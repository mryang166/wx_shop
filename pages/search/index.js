/* 
输入框绑定 值改变事件 input事件 
  获取输入框的值
  合法性判断
  检验通过 发送值到后台
  返回的数据打印到页面上

防抖 防止抖动 定时器
  定义全局定时器
  防抖 防止重复请求
  节流 页面下拉或上拉
*/
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goods: [],
    //取消按钮
    isFocus:false,
    //输入框的值
    inpValue:""
  },
  TimeId: 1,
  //输入值改变就会触发的事件
  handleInput(e) {
    const { value } = e.detail;
    if (!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000)

  },
  //获取搜索建议
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } })
    // console.log(res);
    this.setData({
      goods: res
    })
  },
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
})