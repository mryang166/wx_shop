/*
  点击+触发点击tap事件
    调用选择图片的api
    获取路径 数组
    把图片路径存到data变量中
    页面根据 图片数组 循环显示

  点击 自定义图片 组件
    获取被点击的索引
    获取data中的图片数组
    根据索引 在数组中删除对应元素
    重新设置会data中

  点击提交按钮
    获取文本域的内容
      data定义变量 输入的内容
      文本域 输入事件，事件触发 把值存入
    对这些内容合法性验证
    验证通过 用户选择的图片上传到专门的图片服务器 返回外网链接 ////模拟
      遍历图片数组
      挨个上传
      自己再维护图片数组 存放上传后的外网的链接
    文本域 和 外网图片路径 一起提交到服务器
    清空 返回上一页
*/
Page({
  data: {

    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    //被选中的图片路径数组
    chooseImage: [],
    textValue: ""
  },
  //外网图片路径数组
  UpLoadImgs: [],
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
  //点+ 选择图片
  handleChooseImg() {
    //调用内置api
    wx.chooseImage({
      //同时选择数量
      count: 9,
      //原图 和压缩格式
      sizeType: ['original', 'compressed'],
      //来源 相册 和 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        // console.log(result);
        this.setData({
          //图片数组进行拼接
          chooseImage: [...this.data.chooseImage, ...result.tempFilePaths]
        })
      }
    });

  },
  //点击自定义图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset;
    //获取data中的图片数组
    let { chooseImage } = this.data;
    //删除元素
    // console.log(chooseImage);
    chooseImage.splice(index, 1);
    this.setData({
      chooseImage
    })
  },
  //文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  //提交按钮的点击事件
  handleFormSubmit() {
    //获取文本域的内容
    const { textVal, chooseImage } = this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    //准备上传图片 到专门的图片服务器
    //上传文件api不支持多个文件同时上传 遍历数组 挨个上传
    //没有接口
    //显示正在等待
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }, 2000);
    //判断有无要上传图片
    if(chooseImage.length!=0){
      chooseImage.forEach((v, i) => {
      wx.uploadFile({
        //要上传到哪
        url: '',
        //被上传的文件的路径
        filePath: v,
        //上传文件的名称 方便后端获取
        name: "file",
        //顺带的文本信息
        formData: {},
        success: (result) => {
          // console.log(result);
          // let url = JSON.parse(result.data).url;
          // this.UpLoadImgs.push(url);

          //所有图片上传完毕
          if(i===chooseImage.length-1){
            // wx.hideLoading();
            console.log("把文本的内容和外网的图片数组提交到后台");
            //提交成功了  没办法发送请求
            this.setData({
              textVal:"",
              chooseImage:[]
            })
            // 回1
            wx.navigateBack({
              delta: 1
            });
              
          }
        }
      });
    });
    }else{
      console.log("只提交文本");
    }
      
    

  }
})