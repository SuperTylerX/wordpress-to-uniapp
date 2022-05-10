<template>
	<view class="content" v-if="isShow" @click.stop=" isShow = false ">
		<canvas @click.stop="" :style="{ width: canvasW + 'px', height: canvasH + 'px' }" canvas-id="my-canvas"
			ref="canvas"></canvas>
		<view class="save-btn" @click.stop="saveImage">保存图片</view>
	</view>
</template>

<script>
	import config from "../../utils/config.js";
	import * as API from "../../utils/api.js";

	export default {
		props: {
			headerImg: {
				type: String
			},
			title: {
				type: String
			},
			subTitle: {
				type: String
			},
			abImg: {
				type: String,
			}
		},
		data() {
			return {
				canvasW: 0,
				canvasH: 0,
				ctx: null,
				isShow: false,
				qrcode: ""
			};
		},
		methods: {
			//显示
			showCanvas(qrcode) {
				this.isShow = true;
				this.qrcode = qrcode;
				this.__init();
			},
			//初始化画布
			async __init() {
				uni.showLoading({
					title: "加载中...",
					mask: true
				});
				this.ctx = uni.createCanvasContext("my-canvas", this);
				this.canvasW = uni.upx2px(550);
				this.canvasH = uni.upx2px(780);
				//设置画布背景透明
				this.ctx.setFillStyle("rgba(255, 255, 255, 0)");
				//设置画布大小
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18), "#FFFFFF");
				//获取标题图片

				let hW = uni.upx2px(500);
				let hH = uni.upx2px(320);
				const headerImgRize = API.RESIZE_IMG_URL + "?q=100&zc=1&src=" + this.headerImg + "&w=" + hW + "&h=" +
					hH;
				let headerImg = await this.getImageInfo(headerImgRize);

				//绘制标题图
				this.drawRoundImg(this.ctx, headerImg.path, ((this.canvasW - hW) / 2), ((this.canvasW - hW) / 2), hW,
					hH, uni.upx2px(16));
				//绘制标题
				this.ctx.setFontSize(18); //设置标题字体大小
				this.ctx.setFillStyle("#333"); //设置标题文本颜色
				this.ctx.fillText(this.title, ((this.canvasW - hW) / 2), (
					((this.canvasW - hW) / 2) + hH + uni.upx2px(60)));
				//绘制副标题
				this.ctx.setFontSize(14);
				this.ctx.setFillStyle("#858585");
				let sWidth = this.ctx.measureText(this.subTitle).width;
				if (sWidth > hW) {
					let drawTxt = ""; // 当前绘制的内容
					let drawLine = 1; // 第几行开始绘制
					let drawIndex = 0; // 当前绘制内容的索引
					let lineNum = 3; // 行数
					let lineHeight = 25; // 行高
					let drawX = (this.canvasW - hW) / 2;
					let drawY = (this.canvasW - hW) / 2 + hH + uni.upx2px(110);

					for (let i = 0; i < this.subTitle.length; i++) {
						drawTxt += this.subTitle[i];
						if (this.ctx.measureText(drawTxt).width > hW) {
							if (drawLine >= lineNum) {
								this.ctx.fillText(this.subTitle.substring(drawIndex, i) + "..", drawX, drawY);
								break;
							} else {
								this.ctx.fillText(this.subTitle.substring(drawIndex, i + 1), drawX, drawY);
								drawIndex = i + 1;
								drawLine += 1;
								drawY += lineHeight;
								drawTxt = "";
							}
						} else {
							// 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
							if (i === this.subTitle.length - 1) {
								this.ctx.fillText(this.subTitle.substring(drawIndex), drawX, drawY);
							}
						}
					}

					// this.ctx.fillText(this.subTitle.slice(0, 17) + '...', ((this.canvasW - hW) / 2), (
					// 	((this.canvasW - hW) / 2) + hH + uni.upx2px(110)))
				} else {
					this.ctx.fillText(this.subTitle, ((this.canvasW - hW) / 2), (
						((this.canvasW - hW) / 2) + hH + uni.upx2px(110)));
				}

				//绘制虚线
				this.drawDashLine(this.ctx, uni.upx2px(20), (((this.canvasW - hW) / 2) + hH + uni.upx2px(240)), (this
					.canvasW - uni.upx2px(20)), (((this.canvasW - hW) / 2) + hH + uni.upx2px(240)), 5);
				//左边实心圆
				this.drawEmptyRound(this.ctx, 0, (((this.canvasW - hW) / 2) + hH + uni.upx2px(240)), uni.upx2px(20));
				//右边实心圆
				this.drawEmptyRound(this.ctx, this.canvasW, (((this.canvasW - hW) / 2) + hH + uni.upx2px(240)), uni
					.upx2px(20));
				//提示文案
				this.ctx.setFontSize(12);
				this.ctx.setFillStyle("#858585");
				this.ctx.fillText(`长按识别图中“${config.WEBSITE_NAME}”小程序`, (((this.canvasW - hW) / 2) + uni.upx2px(10)), ((
					(this.canvasW -
						hW) / 2) + hH + uni.upx2px(300)));

				// //底部广告
				// let abImg = API.RESIZE_IMG_URL + "?q=100&zc=1&src=" + this.abImg + "&w=" + uni.upx2px(1400) + "&h=" +
				// 	uni.upx2px(440);

				// // let BottomAdImg = await this.getImageInfo(this.abImg)
				// let BottomAdImg = await this.getImageInfo(abImg);
				// this.ctx.drawImage(BottomAdImg.path, (((this.canvasW - hW) / 2)), (((this.canvasW - hW) / 2) + hH + uni
				// 	.upx2px(310)), uni.upx2px(350), uni.upx2px(110));


				//小程序码
				this.qrcode = API.RESIZE_IMG_URL + "?q=100&zc=1&w=" + uni.upx2px(999) + "&h=" +
					uni.upx2px(999) + "&src=" + encodeURIComponent(this.qrcode);
				let qrcodeImg = await this.getImageInfo(this.qrcode);


				this.ctx.drawImage(qrcodeImg.path, uni.upx2px(384), (((this.canvasW - hW) / 2) + hH + uni.upx2px(264)),
					uni.upx2px(156), uni.upx2px(156));
				//延迟渲染
				setTimeout(() => {
					this.ctx.draw(true, () => {
						uni.hideLoading();
					});
				}, 500);
			},
			//绘制实心圆
			drawEmptyRound(ctx, x, y, radius) {
				ctx.save();
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
				ctx.setFillStyle("rgba(0, 0, 0, .4)");
				ctx.fill();
				ctx.restore();
				ctx.closePath();
			},
			//绘制虚线
			drawDashLine(ctx, x1, y1, x2, y2, dashLength) {
				ctx.setStrokeStyle("#cccccc"); //设置线条的颜色
				ctx.setLineWidth(1); //设置线条宽度
				let dashLen = dashLength,
					xpos = x2 - x1, //得到横向的宽度;
					ypos = y2 - y1, //得到纵向的高度;
					numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
				//利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
				for (let i = 0; i < numDashes; i++) {
					if (i % 2 === 0) {
						ctx.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
						//有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
					} else {
						ctx.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
					}
				}
				ctx.stroke();
			},
			//带圆角图片
			drawRoundImg(ctx, img, x, y, width, height, radius) {
				ctx.beginPath();
				ctx.save();
				// 左上角
				ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
				// 右上角
				ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
				// 右下角
				ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5);
				// 左下角
				ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI);
				ctx.stroke();
				ctx.clip();
				ctx.drawImage(img, x, y, width, height);
				ctx.restore();
				ctx.closePath();
			},
			//圆角矩形
			drawRoundRect(ctx, x, y, width, height, radius, color) {
				ctx.save();
				ctx.beginPath();
				ctx.setFillStyle(color);
				ctx.setStrokeStyle(color);
				ctx.setLineJoin("round"); //交点设置成圆角
				ctx.setLineWidth(radius);
				ctx.strokeRect(x + radius / 2, y + radius / 2, width - radius, height - radius);
				ctx.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2);
				ctx.stroke();
				ctx.closePath();
			},
			//获取图片
			getImageInfo(imgSrc) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgSrc,
						success: (image) => {
							resolve(image);
							console.log("获取图片成功", image);
						},
						fail: (err) => {
							reject(err);
							console.log("获取图片失败", imgSrc, err);
						}
					});
				});
			},
			//保存图片到相册
			saveImage() {

				// #ifdef H5
				const canvasDom = this.$refs.canvas.$el.getElementsByTagName("canvas")[0];
				let image = new Image();
				image.src = canvasDom.toDataURL("image/png");
				let alink = document.createElement("a");
				alink.href = canvasDom.toDataURL("image/png");
				alink.download = "宣传海报.png";
				alink.click();
				return;
				// #endif

				let that = this;

				// #ifdef MP
				//判断用户授权
				uni.authorize({
					scope: "scope.writePhotosAlbum",
					success() {
						uni.canvasToTempFilePath({
							canvasId: "my-canvas",
							quality: 1,
							complete: (res) => {
								console.log("保存到相册", res);
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success(res) {
										uni.showToast({
											title: "已保存到相册",
											icon: "success",
											duration: 2000
										});
										setTimeout(() => {
											that.isShow = false;
										}, 2000);
									}
								});
							}
						}, that);
					}
				});
				// #endif

				// #ifdef APP-PLUS
				uni.canvasToTempFilePath({
					canvasId: "my-canvas",
					quality: 1,
					complete: (res) => {
						console.log("保存到相册", res);
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(res) {
								uni.showToast({
									title: "已保存到相册",
									icon: "success",
									duration: 2000
								});
								setTimeout(() => {
									that.isShow = false;
								}, 2000);
							}
						});
					}
				}, that);
				// #endif

			}
		}
	};
</script>

<style scoped lang="scss">
	.content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .4);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.save-btn {
			margin-top: 35rpx;
			color: #FFFFFF;
			background: linear-gradient(to right, #FE726B, #FE956B);
			padding: 15rpx 40rpx;
			border-radius: 50rpx;
		}
	}
</style>
