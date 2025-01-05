<script setup>
import { ref } from 'vue'
import SparkMD5 from 'spark-md5'

const uploadRef = ref(null)
const selectFile = ref(null)
const chunkSize = ref(2 * 1024 * 1024) // 2MB
const uploadedChunks = ref([])
const fileHash = ref('')

// fileName文件夹 - hash-0.chunk

function handleChange(file) {
    selectFile.value = file.raw
    console.log('handleChange', selectFile.value)
    calculateHash(selectFile.value)
}

function calculateHash(file) {
    const chunkFileSize = chunkSize.value
    const chunks = Math.ceil(file.size / chunkFileSize)
    const spark = new SparkMD5.ArrayBuffer()
    let currentChunk = 0

    const fileReader = new FileReader()

    const loadNext = () => {
        const start = currentChunk * chunkFileSize
        const end = Math.min(start + chunkFileSize, file.size)
        fileReader.readAsArrayBuffer(file.slice(start, end))
    }

    fileReader.onload = (e) => {
        spark.append(e.target.result)
        currentChunk++

        if (currentChunk < chunks) {
            loadNext()
        }
        else {
            fileHash.value = spark.end()
            console.log('文件哈希值:', fileHash.value)
        }
    }

    loadNext() // 触发第一次切片读取
}

async function uploadFile() {
    const chunkCount = Math.ceil(selectFile.value.size / chunkSize.value)
    // 通过文件名加hash, 返回文件是否已经存在切片索引, hash是保证文件的正确性
    const uploadedChunkResponse = await fetch(`http://localhost:3030/qryChunkExist?fileName=${selectFile.value.name}&hash=${fileHash.value}`)
    uploadedChunks.value = await uploadedChunkResponse.json()
    console.log(uploadedChunks.value)

    for (let i = 0; i < chunkCount; i++) {
        // 已经上传过,跳过
        if (uploadedChunks.value.includes(i)) {
            continue
        }
        const chunk = selectFile.value.slice(
            i * chunkSize.value,
            (i + 1) * chunkSize.value,
        )

        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('index', i)
        formData.append('fileName', selectFile.value.name)
        formData.append('hash', fileHash.value)
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
