import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //被点击的左侧的菜单
    currentIndex: 0,
    //右侧内容的滚动太距离顶部的距离
    scrollTop: 0
  },
  //接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*  0 web中的本地存储 和 小程序中的本地存储的区别
          web:localStorage.setItem("key","value")  localStorage.getItem("key") 
          小程序: wx.setStorageSync("key","value")  wx.getStorageSync("key")
          存的时候有没有做类型转换：
            web 不管存入什么类型数据 都会先调用一下 toString(),变成字符串再存入
            小程序  不存在类型转换的 存什么类型的数据 获取的就是什么类型
      1先判断本地存储有无旧数据
      {time:Date.now(), data:[...]}
        2如果没有旧数据 直接发送新请求
        3有旧数据 同时旧数据也没有过期 就使用旧数据即可 */
    // this.getCates()
    // 1 先获取本地存储的数据 （小程序中存在本地存储
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      //不存在 发送请求 获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间 10s
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getCates();
      } else {
        //可以使用旧的数据
        console.log("可以使用旧的数据");
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  //获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then(res => {
    //   // console.log(res);
    //   this.Cates = res.data.message;
    //   /* 把接口的数据存入到本地存储中 */
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
    //   //构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   //构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    //1 使用ES7的async await来发送异步请求
    const res = await request({ url: "/categories" });
    // this.Cates = res.data.message;
    this.Cates = res;
    /* 把接口的数据存入到本地存储中 */
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
    //构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e);
    /* 1获取被点击的标题的索引
       2 给data中的currentIndex赋值
       3 根据不同的索引来渲染右侧的商品内容
    */
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })

  }
})