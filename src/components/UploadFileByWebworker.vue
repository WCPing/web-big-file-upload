<script setup lang="ts">
import { ref } from 'vue'
import { handleEvent, sliceFile, uploadFile } from '../utils/fileUtil.js'

const uploadRef = ref(null)
const selectFile = ref(null)
const progress = ref(0)

function handleChange(file) {
    selectFile.value = file.raw
    console.log('handleChange', selectFile.value)
}

async function submitUpload() {
    console.time()

    sliceFile(selectFile.value).then(({ chunks, chunkCount }) => {
        uploadFile(chunks)

        const { addEventListener } = handleEvent()

        const removeListener = addEventListener(({ detail: schedule }) => {
            progress.value = schedule / chunkCount

            if (schedule === chunkCount) { // 上传完成，关闭事件监听
                selectFile.value = null
                uploadRef.value && uploadRef.value.clearFiles()
                removeListener()
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
        <p>进度：{{ progress * 100 }}%</p>
    </div>
</template>

<style scoped></style>
