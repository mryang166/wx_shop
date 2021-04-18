/**
 * 用户上滑页面 滚动条触底 开始加载下一页数据
 * 1 找到滚动条触底事件 （生命周期事件）
 * 2 判断还有没下一页数据
 *      1 获取到数据的总页数  只有总条数
 *          总页数 = Math.ceil(总条数 / 页容量 pagesize)
 *                = Math.ceil(23 / 10)
 *      2 获取到当前的页码
 *      3 只要判断当前页码是否大于等于 总页数
 *          表示没有下一页了
 * 3 没有下一列就弹出提示框
 * 4 还有下一页数据 来加载下一页数据
 *      当前页码++
 *      重新发请求
 *      拼接数组
 * 
 * 
 * 下拉刷新页面
 *    1 触发下拉刷新 页面的json开启配置项 enablePullDownRefresh
 *        添加逻辑
 *    2 重置数组 清空
 *    3 重置页码 为1
 *    4 重新发送请求
 *    5 数据回来后 关闭等待动画效果
 */

import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      },
    ],
    goodsList: [],
  },
  //接口要的参数 
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // console.log(res)
    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    // console.log(this.data.goodsList)
    this.setData({
      //拼接了数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    //关闭下拉刷新的效果  如果没有调用 直接关效果也没有影响
    wx.stopPullDownRefresh();
  },

  //标题的点击事件  从子组件Tabs传递过来的
  handleTabsItemChange(e) {
    // console.log(e);
    //1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  //页面上滑 滚动条触底事件
  onReachBottom() {
    // console.log("页面触底")
    //判断有无下一页
    if (this.QueryParams.pagenum >= this.totalPages) {
      //没有下一页数据了
      // console.log("没有下一页了")
      wx.showToast({
        title: '已经到底了'
      });

    } else {
      // console.log("还有下一页")
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新页面
  onPullDownRefresh(){
    // console.log("yes")
    //重置数组
    this.setData({
      goodsList:[]
    })
    //重置 页码
    this.QueryParams.pagenum = 1;
    //重新发送请求
    this.getGoodsList()
  }
})