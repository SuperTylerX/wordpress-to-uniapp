<template>
  <view v-if="!!url" class="img-crop">
    <canvas :id="canvasId" type="2d" :canvas-id="canvasId" :style="[canvasStyles]" />
    <view class="container">
      <movable-area class="movable-area" :style="[movableAreaStyles]">
        <movable-view
          class="movable-view"
          :style="[movableViewStyles]"
          direction="all"
          :x="x"
          :y="y"
          :scale-value="scale"
          :scale-min="1"
          :scale-max="maxScale ?? 3"
          scale
          :animation="false"
          @change="handleChange"
          @scale="handleScale"
        >
          <image :src="url" :style="[imageStyles]"></image>
        </movable-view>
      </movable-area>
      <view class="cropper" :style="[cropperStyles]"></view>
      <view class="control">
        <view class="action-btn cancel-btn" @click="$emit('cancel')">
          <text>取消</text>
        </view>
        <view class="action-btn rotate-btn" @click="handleRotate">
          <text>旋转</text>
        </view>
        <view class="action-btn rotate-btn" @click="handleCrop">
          <text>确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, watch, getCurrentInstance } from 'vue'

interface ImgCropProps {
  url?: string
  aspect?: number
  width?: number
  height?: number
  maxScale?: number
}

const props = defineProps<ImgCropProps>()
const emit = defineEmits<{
  (e: 'success', url: string): void
  (e: 'cancel'): void
}>()

const currentInstance = getCurrentInstance()

const canvasId = `img-crop-${Math.random().toString(36).slice(-6)}`

const { windowWidth, windowHeight, pixelRatio } = uni.getSystemInfoSync()
const cropperMaxWidth = windowWidth * 0.7
const cropperMaxHeight = (windowHeight - 48) * 0.8

let originalWidth = 0
let originalHeight = 0
let latestX = 0
let latestY = 0
let latestScale = 1
let imageTempPath: string | undefined = undefined
let image: WechatMiniprogram.Image | undefined = undefined

const movableAreaWidth = ref(0)
const movableAreaHeight = ref(0)

const movableViewWidth = ref(0)
const movableViewHeight = ref(0)

// 初始图像大小，在手机上显示的1倍图大小
const initialImageWidth = ref(0)
const initialImageHeight = ref(0)

// 手机上显示的裁切框大小
const cropperWidth = ref(cropperMaxWidth)
const cropperHeight = ref(cropperMaxWidth)

const canvasWidth = ref(cropperMaxWidth)
const canvasHeight = ref(cropperMaxWidth)

const scale = ref(1)
const rotate = ref(0)

const x = ref(0)
const y = ref(0)

const canvasStyles = computed(() => ({
  width: `${canvasWidth.value * pixelRatio}px`,
  height: `${canvasHeight.value * pixelRatio}px`
}))

const movableAreaStyles = computed(() => {
  ;[movableAreaWidth.value, movableAreaHeight.value] = [cropperWidth.value, cropperHeight.value]
  if (rotate.value % 180 !== 0) {
    ;[movableAreaWidth.value, movableAreaHeight.value] = [
      movableAreaHeight.value,
      movableAreaWidth.value
    ]
  }

  return {
    width: `${movableAreaWidth.value}px`,
    height: `${movableAreaHeight.value}px`
  }
})

const movableViewStyles = computed(() => {
  ;[movableViewWidth.value, movableViewHeight.value] = [
    initialImageWidth.value,
    initialImageHeight.value
  ]
  if (rotate.value % 180 !== 0) {
    ;[movableViewWidth.value, movableViewHeight.value] = [
      movableViewHeight.value,
      movableViewWidth.value
    ]
  }

  return {
    width: `${movableViewWidth.value}px`,
    height: `${movableViewHeight.value}px`
  }
})

const imageStyles = computed(() => ({
  width: `${initialImageWidth.value}px`,
  height: `${initialImageHeight.value}px`,
  transform: `translate(-50%, -50%) rotate(${rotate.value}deg)`
}))

const cropperStyles = computed(() => ({
  width: `${cropperWidth.value}px`,
  height: `${cropperHeight.value}px`
}))

watch(
  props,
  ({ url, aspect = 1, width, height }) => {
    image = imageTempPath = undefined

    if (url) {
      if (width && height) {
        aspect = width / height
      }

      uni.getImageInfo({
        src: url,
        success: res => {
          imageTempPath = res.path
          ;[originalWidth, originalHeight] = [res.width, res.height]
          const originalAspect = originalWidth / originalHeight

          cropperHeight.value = cropperWidth.value / aspect
          if (cropperHeight.value > cropperMaxHeight) {
            cropperHeight.value = cropperMaxHeight
            cropperWidth.value = cropperHeight.value * aspect
          }

          if (originalAspect < aspect) {
            initialImageWidth.value = cropperWidth.value
            initialImageHeight.value = initialImageWidth.value / originalAspect
          } else {
            initialImageHeight.value = cropperHeight.value
            initialImageWidth.value = initialImageHeight.value * originalAspect
          }

          if (width && height) {
            canvasWidth.value = width
            canvasHeight.value = height
          } else {
            const cropperScale = Math.min(
              originalWidth / cropperWidth.value,
              originalHeight / cropperHeight.value
            )
            canvasWidth.value = cropperWidth.value * cropperScale
            canvasHeight.value = cropperHeight.value * cropperScale
          }
        }
      })
    }
  },
  { immediate: true }
)

watch(
  [movableAreaWidth, movableAreaHeight, movableViewWidth, movableViewHeight],
  ([areaWidth, areaHeight, viewWidth, viewHeight]) => {
    latestX = x.value = (areaWidth - viewWidth) / 2
    latestY = y.value = (areaHeight - viewHeight) / 2
    latestScale = scale.value = 1
  }
)

function handleRotate() {
  scale.value = latestScale
  rotate.value += 90
}

function handleChange(e: any) {
  latestX = e.detail.x
  latestY = e.detail.y
}

function handleScale(e: any) {
  latestX = e.detail.x
  latestY = e.detail.y
  latestScale = e.detail.scale
}

async function handleCrop() {
  let timer: any
  uni.showLoading({ title: '正在处理...', mask: true })

  try {
    await Promise.race([crop(), new Promise(resolve => (timer = setTimeout(resolve, 30_000)))])
  } finally {
    clearTimeout(timer)
    uni.hideLoading()
  }
}

async function crop() {
  if (!imageTempPath) {
    return
  }

  let canvas: WechatMiniprogram.Canvas
  let ctx:
    | WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D
    | UniNamespace.CanvasContext

  // #ifdef MP-WEIXIN
  canvas = await new Promise<WechatMiniprogram.Canvas>(resolve => {
    uni
      .createSelectorQuery()
      .in(currentInstance)
      .select(`#${canvasId}`)
      .fields({ node: true } as any, () => {})
      .exec(res => resolve(res[0].node))
  })

  canvas.width = canvasWidth.value * pixelRatio
  canvas.height = canvasHeight.value * pixelRatio

  if (!image) {
    await new Promise((resolve, reject) => {
      image = canvas.createImage()
      image.onload = resolve
      image.onerror = reject
      image.src = imageTempPath!
    })
  }

  ctx = canvas.getContext('2d')
  // #endif

  // #ifndef MP-WEIXIN
  ctx = uni.createCanvasContext(canvasId, currentInstance)
  // #endif

  ctx.scale(pixelRatio, pixelRatio)
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  let [x, y] = [canvasWidth.value / 2, canvasHeight.value / 2]
  ctx.translate(x, y)
  ctx.rotate((rotate.value * Math.PI) / 180)
  ctx.translate(-x, -y)

  // 缩放后图片大小
  const imageWidth = initialImageWidth.value * latestScale
  const imageHeight = initialImageHeight.value * latestScale

  ;[x, y] = [latestX, latestY]

  switch (rotate.value % 360) {
    case 90:
      ;[x, y] = [y, cropperHeight.value - x - imageHeight]
      break
    case 180:
      ;[x, y] = [cropperWidth.value - x - imageWidth, cropperHeight.value - y - imageHeight]
      break
    case 270:
      ;[x, y] = [cropperWidth.value - y - imageWidth, x]
      break
  }

  const cropperScale = canvasWidth.value / cropperWidth.value

  let dx = x * cropperScale
  let dy = y * cropperScale
  const dw = imageWidth * cropperScale
  const dh = imageHeight * cropperScale

  ctx.drawImage((image || imageTempPath) as any, dx, dy, dw, dh)
  // #ifndef MP-WEIXIN
  await new Promise(resolve => (ctx as UniNamespace.CanvasContext).draw(false, resolve))
  // #endif

  const { tempFilePath } = await uni.canvasToTempFilePath({
    canvasId,
    canvas,
    destWidth: canvasWidth.value,
    destHeight: canvasHeight.value,
    fileType: 'jpg'
  })

  emit('success', tempFilePath)
}
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  cursor: move;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}

.movable-area {
  position: absolute;
  left: 50%;
  top: calc(50% - 24px);
  transform: translate(-50%, -50%);
}

.movable-view {
  image {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: ease transform 0.2s;
  }
}

.cropper {
  position: absolute;
  left: 50%;
  top: calc(50% - 24px);
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  box-shadow: 0 0 0 50vh;
  color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  pointer-events: none;
}

.control {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 48px;
  background: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.action-btn {
  padding: 12px 24px;
  font-size: 16px;
}
</style>
