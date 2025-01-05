<script setup>
import { ref } from 'vue'

const uploadRef = ref(null)
const selectFile = ref(null)
const chunkSize = ref(2 * 1024 * 1024) // 2MB

// fileName文件夹 - 0.chunk

function handleChange(file) {
    selectFile.value = file.raw
    console.log('handleChange', selectFile.value)
}

async function uploadFile() {
    const chunkCount = Math.ceil(selectFile.value.size / chunkSize.value)

    for (let i = 0; i < chunkCount; i++) {
        const chunk = selectFile.value.slice(i * chunkSize.value, (i + 1) * chunkSize.value)

        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('index', i)
        formData.append('fileName', selectFile.value.name)
        formData.append('chunkCount', chunkCount)
        await uploadChunk(formData)
    }
}

async function uploadChunk(formData) {
    try {
        const response = await fetch('http://localhost:3030/uploadChunk', {
            method: 'POST',
            body: formData,
        })
        const result = await response.json()
        if (result.type === 'success') {
            console.log('上传成功：', result)
            selectFile.value = null
            uploadRef.value && uploadRef.value.clearFiles()
        }
    }
    catch (error) {
        console.error('上传失败：', error)
    }
}

function submitUpload() {
    uploadFile()
}
</script>

<template>
    <div class="upload-warpper">
        <el-upload ref="uploadRef" class="upload-demo" :http-request="uploadFile" :on-change="handleChange"
            :auto-upload="false" :multiple="false" action="http://localhost:3000/uploadChunk">
            <template #trigger>
                <el-button type="primary">
                    选取文件
                </el-button>
            </template>
            <el-button class="ml-3" @click="submitUpload">
                上传
            </el-button>
        </el-upload>
    </div>
</template>
