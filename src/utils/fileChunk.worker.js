import SparkMD5 from 'spark-md5'

self.onmessage = async function ({ data: { file, chunkSize, startIndex, endIndex } }) {
    const arr = []

    for (let i = startIndex; i < endIndex; i++) {
        arr.push(createChunks(file, i, chunkSize))
    }
    const chunks = await Promise.all(arr)

    // 提交线程信息
    postMessage(chunks)
}

function createChunks(file, index, chunkSize) {
    return new Promise((resolve) => {
        const spark = new SparkMD5.ArrayBuffer()
        // 开始第几个*分片的大小
        const start = index * chunkSize

        // 结束时start + 分片的大小
        const end = Math.min(start + chunkSize, file.size)
        const fileReader = new FileReader()

        // 每个切片都通过FileReader读取为ArrayBuffer
        fileReader.onload = (e) => {
            spark.append(e.target.result)
            const files = file.slice(start, end)
            const chunkHash = spark.end()

            resolve({
                start,
                end,
                index,
                hash: chunkHash, // 生成唯一的hash
                chunk: files,
            })
        }

        // 读取文件的分片
        fileReader.readAsArrayBuffer(file.slice(start, end))
    })
}
