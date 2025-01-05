## web端上传文件的3种方式

##### 1. 文件直接上传（适用于小文件）

##### 2. 文件切片上传（适用于中大文件）

##### 3. 文件切片 + hash上传 (推荐，适用于中大文件)

##### 4. 大文件切片 + Web Worker + hash上传 (适用于超大文件)

#### 项目说明
- 前台基于vue3 + vite + Element UI
- 后台采用node, 基于express + multer

#### 安装依赖

```
pnpm install
```

#### 启动前台

```
pnpm run dev
```

#### 启动后台

```
cd server
pnpm run server
```
