import { ref, reactive, h } from 'vue'
import axios from 'axios'
import jsCookie from 'js-cookie'
import { ElNotification } from 'element-plus'
import { compressImage } from '../../../utils/compressor'

export function useCloudUploadFolders(currentParent, getData) {

    const inputFolderEl = ref(null)

    const uploading = ref(false)
    const progress = ref(0)

    const uploadList = reactive([])


    function openUploadFolders(){
        if(inputFolderEl.value){
            inputFolderEl.value.click()
        }
    }


    function downloadErrorLog(failedFiles, filename = 'folder_upload_error_log.txt'){
        const logContent = failedFiles.map(item => {
            return `name: ${item.path || item.name}, reason: ${item.message}`
        }).join('\n')

        const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)
    }


    async function createFolder(name, parent = null){
        if(!name?.trim()){
            return {
                type: 'error',
                message: '資料夾名稱不可為空。'
            }
        }

        try{
            const res = await axios.post('/api/cloud/user/createFolder',
                {
                    name: name.trim(),
                    parent
                },
                {
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                }
            )
            return res.data
        }catch(e){
            console.error(e)
            return {
                type: 'error',
                message: e.response?.data?.message || '資料夾新增失敗。'
            }
        }
    }


    async function uploadSingleFile(file, parent, item){
        let fileToUpload = file

        // 判斷是否為需要壓縮的圖片格式（避開 SVG 與 GIF）
        const isImage = file.type?.startsWith('image/')
        const isSvgOrGif = ['image/svg+xml', 'image/gif'].includes(file.type)

        if (isImage && !isSvgOrGif) {
            try {
                item.message = '圖片壓縮中...'
                fileToUpload = await compressImage(file)
            } catch (err) {
                console.warn(`[compress] ${file.name} 壓縮失敗，將使用原始檔案上傳:`, err)
            }
        }

        const formData = new FormData()
        formData.append('file', fileToUpload)

        if(parent){
            formData.append('parent', parent)
        }

        const res = await axios.post('/api/cloud/user/upload',
            formData,
            {
                headers: {
                    'x-user-token': jsCookie.get('authToken')
                },
                onUploadProgress: (event) => {
                    if(!event.total) return
                    item.progress = Math.round((event.loaded / event.total) * 100)
                }
            }
        )

        return res.data
    }


    async function createFolderStructure(fileList, parent, onProgress){
        const folderMap = new Map()

        // 根目錄
        folderMap.set('', parent || null)

        // 收集所有需要建立的資料夾
        const folderPaths = new Set()

        fileList.forEach(file => {
            const pathParts = file.webkitRelativePath.split('/')
            // 最後一個是檔案名稱
            pathParts.pop()

            let currentPath = ''
            pathParts.forEach(part => {
                currentPath = currentPath
                    ? `${currentPath}/${part}`
                    : part
                folderPaths.add(currentPath)
            })
        })

        // 依深度排序，確保父資料夾先建立（已修正原語法問題）
        const sortedFolders = Array.from(folderPaths).sort((a, b) => {
            return a.split('/').length - b.split('/').length
        })

        // 逐層建立資料夾
        for(let i = 0; i < sortedFolders.length; i++){
            const folderPath = sortedFolders[i]

            if(onProgress){
                onProgress(i + 1, sortedFolders.length)
            }

            const parts = folderPath.split('/')
            const folderName = parts[parts.length - 1]
            const parentPath = parts.slice(0, -1).join('/')
            const folderParent = folderMap.get(parentPath)

            const result = await createFolder(folderName, folderParent)

            if(result.type !== 'success'){
                throw new Error(`資料夾建立失敗：${folderPath}`)
            }

            folderMap.set(folderPath, result.data.token)
        }

        return folderMap
    }


    async function uploadFolder(files, parent, onProgress){
        const fileList = Array.from(files)

        if(!fileList.length){
            return {
                results: [],
                failedFiles: []
            }
        }

        uploading.value = true
        progress.value = 0
        uploadList.splice(0)

        // 建立上傳清單
        fileList.forEach(file => {
            uploadList.push({
                file,
                name: file.name,
                path: file.webkitRelativePath,
                progress: 0,
                status: 'waiting',
                message: ''
            })
        })

        try{
            // 1. 建立資料夾結構
            const folderMap = await createFolderStructure(fileList, parent, (created, total) => {
                if(onProgress?.onFolderProgress){
                    onProgress.onFolderProgress(created, total)
                }
            })

            // 2. 逐一上傳檔案
            let completed = 0
            const results = []

            for(let index = 0; index < fileList.length; index++){
                const file = fileList[index]
                const item = uploadList[index]

                item.status = 'uploading'
                item.progress = 0
                item.message = ''

                try{
                    const pathParts = file.webkitRelativePath.split('/')
                    pathParts.pop() // 移除檔案名稱

                    const folderPath = pathParts.join('/')
                    const fileParent = folderMap.get(folderPath)

                    // 在 uploadSingleFile 內完成壓縮判斷與上傳
                    const result = await uploadSingleFile(file, fileParent, item)
                    results[index] = result

                    if(result.type === 'success'){
                        item.status = 'success'
                        item.progress = 100
                        item.message = ''
                    } else {
                        item.status = 'error'
                        item.message = result.message || '檔案上傳失敗。'
                    }
                }catch(e){
                    console.error(e)

                    item.status = 'error'
                    item.message = e.response?.data?.message || e.message || '檔案上傳失敗。'

                    results[index] = {
                        type: 'error',
                        name: file.name,
                        path: file.webkitRelativePath,
                        message: item.message
                    }
                }

                completed++
                progress.value = Math.round((completed / fileList.length) * 100)

                if(onProgress?.onFileProgress){
                    onProgress.onFileProgress(completed, fileList.length)
                }
            }

            // 找出失敗檔案
            const failedFiles = uploadList.filter(item => item.status === 'error')

            // 更新 Cloud 資料
            await getData()

            return {
                results,
                failedFiles
            }

        }finally{
            uploading.value = false
        }
    }


    async function handleUploadFolder(event){
        const files = event.target.files
        if(!files?.length) return

        const progressText = ref(`正在建立目錄結構...`)

        const notification = ElNotification({ 
            title: '資料夾上傳進度', 
            message: () => h('span', progressText.value), 
            type: 'warning', 
            showClose: false, 
            duration: 0, 
            position: 'bottom-right' 
        })

        try{
            const { failedFiles } = await uploadFolder(
                files, 
                currentParent.value, 
                {
                    onFolderProgress: (created, total) => {
                        progressText.value = `正在建立目錄結構 (${created}/${total})...`
                    },
                    onFileProgress: (completed, total) => {
                        progressText.value = `資源正在上傳中 (${completed}/${total})...`
                    }
                }
            )

            event.target.value = ''

            if(failedFiles.length) {
                downloadErrorLog(failedFiles)
            }
            
            ElNotification({ 
                title: '資料夾上傳結果', 
                message: '資料夾上傳完畢。', 
                type: 'success', 
                position: 'bottom-right' 
            })

        }
        catch(e){
            console.error(e)
            event.target.value = ''
            ElNotification({ 
                title: '資料夾上傳結果', 
                message: e.message || '資料夾結構建立失敗。', 
                type: 'error', 
                position: 'bottom-right' 
            })
        }
        finally{
            notification.close()
        }
    }


    return {
        inputFolderEl,
        uploading,
        progress,
        uploadList,
        createFolder,
        openUploadFolders,
        handleUploadFolder
    }
}