//0 引入 用来发送请求的方法 一定要把路径写全
import { request } from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperList: [],
    //导航 数组
    catesList:[],
    //楼层数据
    floorList:[]
  },
  //页面开始加载时 触发的生命周期事件
  onLoad: function (options) {
    //1 发送异步请求 获取轮播图数据
    //优化手段可以通过 ES6 的promise来解决问题
    /* wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
      success: (result) => {
        console.log(result);
        this.setData({
          swiperList:result.data.message
        })
      },
      fail: () => { console.log("获取轮播图失败") }
    }); */
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  //获取分类导航数据
  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  //获取分类导航数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  }

});
