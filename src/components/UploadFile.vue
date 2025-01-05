<script setup>
import { ref } from 'vue'

const uploadRef = ref(null)
const selectFile = ref(null)

function handleChange(file) {
    selectFile.value = file.raw
    console.log('handleChange', selectFile.value)
}

function uploadFile() {
    const formData = new FormData()
    formData.append('fileName', selectFile.value.name)
    formData.append('file', selectFile.value)
    try {
        const response = fetch('http://localhost:3030/upload', {
            method: 'POST',
            body: formData,
        })
        response.then((res) => {
            return res.json()
        }).then((resp) => {
            console.log(resp.message)
            selectFile.value = null
            uploadRef.value && uploadRef.value.clearFiles()
        })
    }
    catch (error) {
        console.error('上传失败：', error)
    }
}
</script>

<template>
    <div class="upload-warpper">
        <el-upload ref="uploadRef" class="upload-demo" :on-change="handleChange" :auto-upload="false" :multiple="false"
            :limit="1" action="http://localhost:3000/upload">
            <template #trigger>
                <el-button type="primary">
                    选取文件
                </el-button>
            </template>
            <el-button class="ml-3" @click="uploadFile">
                上传
            </el-button>
        </el-upload>
    </div>
</template>

<style scoped></style>
