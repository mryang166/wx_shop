/* 
页面被打开 onShow
  0 onShow 不同与onLoad 无法在形参在接受options参数
  1 判断缓存中有无token 如果没有跳转授权
  获取url上的参数 type
  根据type值决定页面标题数组元素哪个被激活
  根据type值发送请求 获取订单数据
  渲染页面

点击不同标题
  点击不同标题 重新发送请求 获取和渲染数据
*/
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },
  onShow(options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    //获取当前小程序的页面栈-数组 页面栈长度最大是10页面
    let pages = getCurrentPages();
    //数组中索引最大页面为当前页面
    let currentPage = pages[pages.length - 1];
    // console.log(currentPage.options);
    const { type } = currentPage.options;
    //激活选中页面标题 index = type - 1
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  //获取订单列表
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    // console.log(res);
    this.setData({
      orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  //根据标题索引激活标题数组
  changeTitleByIndex(index) {
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    // console.log(e);
    //1 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    //重新发送请求 type=1 index=0
    this.getOrders(index+1);
  }
})