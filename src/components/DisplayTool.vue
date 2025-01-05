<script setup>
import { computed } from 'vue'
import { convertFileSize, convertTime } from '../utils/common'

const props = defineProps({
    fileSize: Number,
    uploadTime: Number,
})

const fileUploadSize = computed(() => {
    return convertFileSize(props.fileSize)
})

const fileUploadTime = computed(() => {
    return convertTime(props.uploadTime)
})
</script>

<template>
    <div class="displayTool">
        <span v-if="fileSize">大小: {{ fileUploadSize }}mb</span>
        <span v-if="uploadTime"> , 用时: {{ fileUploadTime }}s</span>
    </div>
</template>

<style scoped>
.displayTool {
    color: #666666;
    font-size: 12px;
}
</style>
