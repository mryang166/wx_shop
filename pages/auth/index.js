import { login } from "../../utils/asyncWx"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from '../../request/index.js'
Page({
  //获取用户信息
  async handleGetUserInfo(e) {
    try {
      //1 获取用户信息
      // const { encryptedData, rawData, iv, signature } = e.detail;
      //2 获取小程序登录成功后的值
      const { code } = await login();
      // const loginParams = { encryptedData, rawData, iv, signature, code }
      //3 发送请求 获取用户token值
      // const { token } = await request({ url: "/users/wxlogin", data: loginParams, methods: "post" })
      //模拟token
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      //4 把token存储到缓存中 跳转
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error)
    }
  }
})