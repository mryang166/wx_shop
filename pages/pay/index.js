/**
 * 
页面加载的时候
    从缓存获取数据 渲染到页面
        checked必须为true
微信支付
    哪些人 哪些账号可以实现微信支付
        企业账号
        企业账号的小程序后台中 必须 给开发者添加白名单、
            一个appid可以同时绑定多个开发者
            这些开发者可以共用appid 和 开发权限
支付按钮
    先判断缓存中有无token
        没有 跳转到授权页面 获取token
        有token 创建订单 获取订单编号
        完成支付 
        手动删除缓存中被选中的商品
        删除后的购物车数据填充回缓存
        跳转页面
        
 */
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from '../../request/index'
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    //一 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    // this.setData({ address })
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  //tap to pay
  async handleOrderPay() {
    try {
      //判断缓存有无token
      const token = wx.getStorageSync("token");
      //判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // console.log("已经存在token")
      //创建订单
      //准备请求头参数
      // const header = { Authorization: token }
      //准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      //准备发请求 创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams })
      //发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } })
      //发起微信支付
      await requestPayment(pay);
      //查询后台订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } })
      await showToast({ title: "支付成功" })
      //手动删除缓存中已经支付的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
        
      //跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });

    } catch (error) {
      await showToast({ title: "没用的，谢谢" })
      console.log(error);
      //跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    }
  }
})