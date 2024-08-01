<template>
  <view class="page-height">
    <view class="page-content">
      <view class="wrap">
        <view class="popup-bg">
          <view class="popup-content popup-content-show">
            <view class="update-wrap">
              <!--              <u-icon-->
              <!--                v-if="downStatus < 1 && !isForceUpdate"-->
              <!--                name="close"-->
              <!--                class="close-icon"-->
              <!--                @click="closeUpdate"-->
              <!--              ></u-icon>-->
              <image src="/static/update-img.png" class="top-img"></image>
              <view class="content">
                <text class="title">发现新版本 V{{ updatedVersion }}</text>
                <!-- 升级描述 -->
                <scroll-view class="title-sub" scroll-y>
                  <view v-for="(item, index) in note" :key="index">
                    {{ item }}
                  </view>
                </scroll-view>

                <!-- 升级按钮 -->
                <button v-if="downStatus < 1" class="btn" @click="onUpdate">立即升级</button>

                <view v-if="downStatus < 1 && !isForceUpdate" class="cancel" @click="closeUpdate"
                  >下次再说</view
                >

                <!-- 下载进度 -->
                <view v-if="downStatus >= 1" class="sche-wrap">
                  <!-- 更新包下载中 -->
                  <view class="sche-bg">
                    <view class="sche-bg-jindu" :style="lengthWidth"></view>
                  </view>
                  <text class="down-text"
                    >下载进度:{{ (downSize / 1024 / 1024).toFixed(2) }}M/{{
                      (fileSize / 1024 / 1024).toFixed(2)
                    }}M</text
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { useSystemStore } from '@/store/system'

export default {
  data() {
    return {
      updatedVersion: '',
      updatedVersionCode: 0,
      downloadLink: '',
      iosDownloadLink: '',
      isForceUpdate: false,
      note: [] as string[], //升级说明数组格式
      fileSize: 0, //文件大小
      downSize: 0, //已下载大小
      downing: false, //是否下载中
      downStatus: 0 // 0未下载 1已开始 2已连接到资源 3已接收到数据 4下载完成
    }
  },
  onLoad(option) {
    if (!option) {
      return
    }
    const appUpdatedVersion = useSystemStore().appUpdatedVersion

    this.note = appUpdatedVersion.updateLog.split('\n') //版本说明
    this.updatedVersionCode = appUpdatedVersion.updatedVersionCode //版本号Code
    this.updatedVersion = appUpdatedVersion.updatedVersion //版本号
    this.downloadLink = appUpdatedVersion.downloadLink //下载地址
    this.iosDownloadLink = appUpdatedVersion.iosDownloadLink //ios下载地址
    this.isForceUpdate = appUpdatedVersion.isForceUpdate //是否强制更新
  },
  onBackPress(e) {
    // APP安卓物理返回键逻辑
    if (e.from === 'backbutton') {
      return true // 禁止返回
    }
  },
  computed: {
    // 下载进度计算
    lengthWidth() {
      let w = (this.downSize / this.fileSize) * 100
      if (!w) {
        w = 0
      } else {
        w = Number(w.toFixed(2))
      }
      return {
        width: w + '%'
      }
    }
  },
  methods: {
    // 当点击更新时
    onUpdate() {
      // 判断是Android还是IOS
      if (useSystemStore().systemInfo.platform === 'android') {
        this.openAndroidUpdate()
      } else {
        this.openIosUpdate()
      }
    },
    openIosUpdate() {
      plus.runtime.openURL(this.downloadLink, () => {
        //调用外部浏览器打开更新地址
        plus.nativeUI.toast('无法打开下载链接')
      })
    },
    openAndroidUpdate() {
      uni.getNetworkType({
        success: res => {
          if (res.networkType === 'wifi') {
            this.startUpdate() //开始更新
          } else {
            uni.showModal({
              title: '提示',
              content: '当前网络非WIFI，继续更新可能会产生流量，确认要更新吗？',
              success: modal_res => {
                if (modal_res.confirm) {
                  this.startUpdate() //开始更新
                }
              }
            })
          }
        }
      })
    },
    //开始更新
    startUpdate() {
      if (this.downing) {
        return false //如果正在下载就停止操作
      }
      this.downing = true //状态改变 正在下载中
      if (/\.apk$/.test(this.downloadLink)) {
        // 如果是apk地址
        this.downloadApk() // 安装包/升级包更新
      } else if (/\.wgt$/.test(this.downloadLink)) {
        // 如果是更新包
        this.downloadApk() // 安装包/升级包更新
      } else {
        plus.runtime.openURL(this.downloadLink, () => {
          //调用外部浏览器打开更新地址
          plus.nativeUI.toast('无法打开下载链接')
        })
      }
    },
    // 下载升级资源包
    downloadApk() {
      plus.nativeUI.showWaiting('准备中，请稍后...') //下载更新文件...
      const dtask = plus.downloader.createDownload(this.downloadLink, {
        method: 'GET'
      })
      dtask.addEventListener('statechanged', (task, status) => {
        if (!status) {
          return
        }
        if (status === 200) {
          this.downStatus = task.state as number
          switch (task.state) {
            case 3: // 已接收到数据
              plus.nativeUI.closeWaiting()
              this.downSize = task.downloadedSize as number
              if (task.totalSize) {
                this.fileSize = task.totalSize //服务器须返回正确的content-length才会有长度
              }
              break
            case 4:
              this.installApk(task.filename as string) // 安装
              break
          }
        } else {
          plus.nativeUI.closeWaiting()
          plus.nativeUI.toast('下载出错')
          this.downing = false
          this.downStatus = 0
        }
      })
      dtask.start()
    },
    // 安装文件
    installApk(path: string) {
      plus.nativeUI.showWaiting('安装更新文件...') //安装更新文件...
      plus.runtime.install(
        path,
        {},
        () => {
          plus.nativeUI.closeWaiting()
          // 应用资源下载完成
          plus.nativeUI.alert('更新完成，请重启APP', () => {
            plus.runtime.restart() //重启APP
          })
        },
        e => {
          plus.nativeUI.closeWaiting()
          // 安装更新文件失败
          plus.nativeUI.alert('安装更新文件失败[' + e.code + ']：' + e.message)
        }
      )
    },
    // 取消更新
    closeUpdate() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss">
page {
  background: transparent;
}
</style>

<style lang="scss" scoped>
.page-height {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba($color: #000000, $alpha: 0.7);
}

.popup-bg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 750rpx;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-content-show {
  animation: mymove 300ms;
  transform: scale(1);
}

@keyframes mymove {
  0% {
    transform: scale(0);
    /*开始为原始大小*/
  }

  100% {
    transform: scale(1);
  }
}

.update-wrap {
  width: 580rpx;
  border-radius: 18rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 170rpx 30rpx 0;

  .close-icon {
    width: 70rpx;
    height: 70rpx;
    position: absolute;
    right: 0;
    top: 10rpx;
    z-index: 10;
  }

  .top-img {
    position: absolute;
    left: 0;
    width: 100%;
    height: 256rpx;
    top: -128rpx;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 40rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #6526f3;
    }

    .title-sub {
      font-size: 24rpx;
      color: #666666;
      padding: 30rpx 0;
      max-height: 300rpx;
    }

    .btn {
      width: 460rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 30rpx;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 100px;
      background-color: #6526f3;
      margin-top: 20rpx;
      flex: 1;
    }

    .cancel {
      margin-top: 20rpx;
      color: #cccccc;
      font-size: 27rpx;
    }
  }
}

.sche-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 10rpx 50rpx 0;

  .sche-wrap-text {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 20rpx;
  }

  .sche-bg {
    position: relative;
    background-color: #cccccc;
    height: 30rpx;
    border-radius: 100px;
    width: 480rpx;
    display: flex;
    align-items: center;

    .sche-bg-jindu {
      position: absolute;
      left: 0;
      top: 0;
      height: 30rpx;
      min-width: 40rpx;
      border-radius: 100px;
      background: #6526f3;
      background-size: 26rpx 26rpx;
    }
  }

  .down-text {
    font-size: 24rpx;
    color: #6526f3;
    margin-top: 16rpx;
  }
}
</style>
