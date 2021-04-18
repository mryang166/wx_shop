//同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
    //判断url中 是否带有字符串 /my/ 请求的是私有的路径 带上header token
    let header = {...params.header};
    if (params.url.includes("/my/")) {
        //拼接header带上token
        header["Authorization"] = wx.getStorageSync("token");
    }
    ajaxTimes++;
    //显示加载中
    wx.showLoading({
        title: "加载中",
        mask: true
    });

    //定义公共url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                // resolve(result);
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    //关闭正在等待的图标
                    wx.hideLoading();
                }

            }
        });

    })
}