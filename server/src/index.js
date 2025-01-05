const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()
const corsOptions = {
    origin: 'http://localhost:3333',
    credentials: true,
}
app.use(cors(corsOptions))

const upload = multer({ dest: 'uploads/temps/' }) // 设置上传文件的临时存储目录

/* 单文件上传 */
app.post('/upload', upload.single('file'), (req, res) => {
    const { fileName } = req.body
    // 处理文件
    const finalFilePath = path.join(__dirname, '../uploads/files', fileName)
    // 文件重命名
    fs.renameSync(req.file.path, finalFilePath)
    res.send({ message: '上传成功' })
})

/*
   hash+切片文件上传
   hash不存在则用fileName代替
 */
app.post('/uploadChunk', upload.single('chunk'), async (req, res) => {
    const { file } = req
    const { index: chunkIndex, fileName, hash, chunkCount } = req.body
    const chunksDir = path.join(__dirname, '../uploads/chunks', fileName)
    const finalFile = path.join(__dirname, '../uploads/files', fileName)

    const chunkName = `${hash || fileName}-${chunkIndex}.chunk` // 13143171616e465816-0.chcunk

    // 确保chunks目录存在
    if (!fs.existsSync(chunksDir)) {
    // 不存在，则新建chunk目录
        fs.mkdirSync(chunksDir, { recursive: true })
    }
    const chunkPath = path.join(chunksDir, chunkName)

    fs.copyFileSync(file.path, chunkPath) // 将临时文件复制到最终位置

    const existCount = fs.readdirSync(chunksDir).length
    const allChunksUploaded = existCount === Number(chunkCount)

    if (allChunksUploaded) {
        await mergeChunks(chunksDir, finalFile, chunkName) // 合并切片

        res.send({ type: 'success', message: `文件 ${fileName} 上传完成` })

        // 清理chunks目录
        fs.rmdirSync(chunksDir, { recursive: true })
    }
    else {
        res.send({ type: 'pending', message: `${fileName} 的第${chunkIndex}切片已经上传完成，等待其他切片！` })
    }
})

// 合并切片函数
async function mergeChunks(chunksDir, finalFile) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(finalFile)
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)

        // 读取所有切片文件名
        const chunks = fs.readdirSync(chunksDir).sort((a, b) => {
        // 确保按正确顺序合并文件: 例子: hash-0.chunk, hash-1.chunk, ...
            return Number(a.split('-')[1]) - Number(b.split('-')[1])
        })

        // 使用异步函数按顺序处理每个切片
        async function mergeChunks(chunks) {
            for (const chunkName of chunks) {
                const chunkPath = path.join(chunksDir, chunkName)

                // 使用 Promise 包装单个切片的处理
                await new Promise((resolveChunk, rejectChunk) => {
                    const readStream = fs.createReadStream(chunkPath)

                    readStream.on('end', () => {
                        fs.unlinkSync(chunkPath) // 删除已合并的切片文件
                        resolveChunk()
                    })

                    readStream.on('error', rejectChunk)
                    readStream.pipe(writeStream, { end: false })
                })
            }

            writeStream.end() // 所有切片处理完后才结束写入流
        }

        // 执行合并操作
        mergeChunks(chunks).catch(reject)
    })
}

// 获取已经存在的chunks
app.get('/qryChunkExist', (req, res) => {
    const { fileName, hash } = req.query
    const uploadedChunks = []
    // 构建目标chunk文件所在的目录路径
    const chunksDir = path.join(__dirname, '../uploads/chunks', fileName)
    // 先判断目录是否存在
    if (fs.existsSync(chunksDir)) {
        // 查看是不是已经存在目标chunk文件索引
        fs.readdirSync(chunksDir).forEach((file) => {
            const match = file.match(new RegExp(`${hash}-(\\d+)`))
            if (match) {
                uploadedChunks.push(Number(match[1]))
            }
        })
    }
    res.json(uploadedChunks)
})

app.post('/upload-monitor', (req, res) => {
    console.log(req.body)
    res.send({ message: 'OK' })
})

// 解析req.body中的内容
app.use(express.json())

app.listen('3030', () => {
    console.log('[File Upload Server] started on http://localhost:3030')
})
