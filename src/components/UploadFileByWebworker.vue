<script setup lang="ts">
import { ref } from 'vue'
import { handleEvent, sliceFile, uploadFile } from '../utils/fileUtil.js'
import DisplayTool from './DisplayTool.vue'

const uploadRef = ref(null)
const selectFile = ref(null)
const selectFileSize = ref(null)
const uploadTime = ref(null)
const startTime = ref(null)
const progress = ref(0)

function handleChange(file) {
    selectFile.value = file.raw
    console.log('handleChange', selectFile.value)
    selectFileSize.value = selectFile.value.size
    uploadTime.value = null
}

async function submitUpload() {
    startTime.value = performance.now()

    sliceFile(selectFile.value).then(({ chunks, chunkCount }) => {
        uploadFile(chunks)

        const { addEventListener } = handleEvent()

        const removeListener = addEventListener(({ detail: schedule }) => {
            progress.value = schedule / chunkCount

            if (schedule === chunkCount) { // 上传完成，关闭事件监听
                removeListener()
                selectFile.value = null
                uploadTime.value = performance.now() - startTime.value
                if (uploadRef.value) {
                    uploadRef.value.clearFiles()
                }
            }
        })
    })

    console.timeEnd()
}
</script>

<template>
    <div class="upload-warpper">
        <el-upload ref="uploadRef" class="upload-demo" :on-change="handleChange" :auto-upload="false" :multiple="false"
            action="http://localhost:3000/upload">
            <template #trigger>
                <el-button type="primary">
                    选取文件
                </el-button>
            </template>
            <el-button class="ml-3" @click="submitUpload">
                上传
            </el-button>
        </el-upload>
        <DisplayTool v-if="selectFileSize || uploadTime" :file-size="selectFileSize" :upload-time="uploadTime" />
        <p>进度：{{ progress * 100 }}%</p>
    </div>
</template>

<style scoped></style>
