<script setup>
import UploadFile from './components/UploadFile.vue'
import UploadFileByChunks from './components/UploadFileByChunks.vue'
import UploadFileByHashChunks from './components/UploadFileByHashChunks.vue'
import UploadFileByWebworker from './components/UploadFileByWebworker.vue'

// // 页面停留时间监控
// function reportData() {
//     const startTime = performance.now()

//     const logView = async () => {
//         if (!navigator.sendBeacon) {
//             return false
//         }
//         const endTime = performance.now()

//         const monitorData = {
//             page: 'file upload with hash',
//             staytime: `${((endTime - startTime) / 60000).toFixed(2)} min`,
//         }
//         const resData = new Blob([JSON.stringify(monitorData)], { type: 'application/json; charset=UTF-8' })
//         navigator.sendBeacon('http://localhost:3030/upload-monitor', resData)
//     }

//     // 不推荐或避免使用 unload 和 beforeunload, 因为在许多情况下（尤其是移动设备）浏览器不会产生 unload、beforeunload 或 pagehide 事件
//     window.addEventListener('visibilitychange', () => {
//         if (document.visibilityState === 'hidden') {
//             logView()
//         }
//     })
// }
// reportData()
</script>

<template>
    <h2>针对web端大文件上传的多重方式</h2>
    <hr>
    <p>直接上传</p>
    <UploadFile />
    <hr>
    <p>切片上传</p>
    <UploadFileByChunks />
    <hr>
    <p>
        切片+hash上传
        <el-tag round type="primary">
            推荐
        </el-tag>
    </p>
    <UploadFileByHashChunks />
    <hr>
    <p>web-worker+hash上传</p>
    <UploadFileByWebworker />
</template>

<style scoped></style>
