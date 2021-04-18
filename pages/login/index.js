// pages/login/index.js
Page({
  /* handleGetUserInfo(e) {
    // console.log(e)
    const { userInfo } = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }, */
  getUserInfo() {
    let self = this
    wx.getUserProfile({
      desc: "获取你的昵称、头像、地区及性别", // 不写不弹提示框
      success: res => {
        const { userInfo } = res;
        wx.setStorageSync("userinfo", userInfo);
        // console.log(userInfo)
        wx.navigateBack({
          delta: 1
        });

      },
      fail: res => {
        //拒绝授权
        wx.showToast({
          title: '您拒绝了授权',
          icon: 'none'
        })
        return;
      }
    })
  }
})