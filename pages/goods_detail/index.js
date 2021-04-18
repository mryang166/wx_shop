/**
 * 1发送请求获取数据
 * 2点击轮播图预览大图
 *  轮播图绑定点击事件
 *  调用api previewImage
 * 
 * 3点击加入购物车
 *    绑定点击事件
 *    获取缓存中购物车的数据 数组格式
 *    先判断当前商品是否已经存在与购物车
 *    已经存在，修改商品数据 数量++ 重新把购物车数组填充回缓存中
 *    不存在，直接给购物车数组添加新元素 新元素 带上 购买数量属性 num重新填充回缓存
 *    弹出提示
 * 4商品收藏
 *    页面onShow的时候 加载缓存中商品收藏的数据
 *    判断当前商品是不是被收藏的
 *        是 改变页面图标
 *    点击收藏按钮
 *        判断该商品是否存在缓存
 *        已经存在删除商品
 *        没有存在 添加到收藏数组中 存入到缓存中
 */
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    //收藏
    isCollect: false
  },
  //商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options
    const { goods_id } = options
    // console.log(goods_id)
    this.getGoodsDetail(goods_id);

  },
  //获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } })
    this.GoodsInfo = goodsObj;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    //判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    // console.log(res);
    this.setData({
      // goodsObj
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        //iphone部分手机 不识别webp格式
        //找服务端 修改
        // 临时自己改也行 确保后端存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  //点击轮播图 方法预览
  handlePreviewImage(e) {
    // console.log("yulan")
    //构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    //接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });

  },
  //点击加入购物车
  handleCartAdd() {
    // console.log("cart")
    //1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    //2 判断商品对象是否存在购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      //3不存在 即第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      //4已经存在 执行num++
      cart[index].num++;
    }
    //5把购物车添加回缓存中
    wx.setStorageSync("cart", cart);
    //6 弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500,
      //防止用户 手抖 疯狂点击
      mask: true
    });


  },
  //收藏点击
  handleCollect() {
    let isCollect = false;
    let collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index !== -1) {
      //已经收藏了，取消收藏操作，收藏数组删除
      collect.splice(index, 1);
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });

    } else {
      collect.push(this.GoodsInfo);
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    //修改 isCollect
    this.setData({
      isCollect
    })
  }
})