import { ref, reactive } from 'vue'
import axios from 'axios'
import jsCookie from 'js-cookie'
import { eventBus } from '../../../utils/eventBus';

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

    async function createFolder(name, parent = null){

        if(!name?.trim()){

            return {
                type:'error',
                message:'資料夾名稱不可為空。'
            }

        }

        try{

            const res = await axios.post('/api/cloud/user/createFolder',
                {
                    name:name.trim(),
                    parent
                },
                {
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                }
            )

            return res.data

        }catch(e){

            console.log(e)

            return {
                type:'error',
                message:'資料夾新增失敗。'
            }

        }

    }


    async function uploadSingleFile(file, parent, item){

        const formData = new FormData()

        formData.append('file', file)

        if(parent){
            formData.append('parent', parent)
        }

        const res = await axios.post('/api/cloud/user/upload',
            formData,
            {
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                },
                onUploadProgress:(event) => {

                    if(!event.total) return

                    item.progress = Math.round(
                        (event.loaded / event.total) * 100
                    )

                }
            }
        )

        return res.data

    }


    async function createFolderStructure(fileList, parent){

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


        // 依深度排序
        const sortedFolders = Array.from(folderPaths).sort((a, b) => {

            return a.split('/').length - b.split('/').length

        })


        // 逐層建立資料夾
        for(const folderPath of sortedFolders){

            const parts = folderPath.split('/')

            const folderName = parts[parts.length - 1]

            const parentPath = parts
                .slice(0, -1)
                .join('/')

            const folderParent = folderMap.get(parentPath)

            const result = await createFolder(
                folderName,
                folderParent
            )

            if(result.type !== 'success'){

                throw new Error(
                    `資料夾建立失敗：${folderPath}`
                )

            }

            // ⚠️ 假設後端回傳 data.token
            folderMap.set(
                folderPath,
                result.data.token
            )

        }

        return folderMap

    }


    async function uploadFolder(files, parent, concurrency = 4){

        const fileList = Array.from(files)

        if(!fileList.length) return []

        uploading.value = true
        progress.value = 0

        uploadList.splice(0)

        fileList.forEach(file => {

            uploadList.push({
                file,
                name:file.name,
                path:file.webkitRelativePath,
                progress:0,
                status:'waiting'
            })

        })


        try{

            // =========================
            // 1. 建立資料夾結構
            // =========================

            const folderMap = await createFolderStructure(
                fileList,
                parent
            )


            // =========================
            // 2. 開始上傳檔案
            // =========================

            let currentIndex = 0
            let completed = 0

            const results = []


            const worker = async () => {

                while(true){

                    const index = currentIndex++

                    if(index >= fileList.length) break

                    const file = fileList[index]

                    const item = uploadList[index]

                    item.status = 'uploading'


                    try{

                        const pathParts = file.webkitRelativePath
                            .split('/')

                        // 移除檔案名稱
                        pathParts.pop()

                        const folderPath = pathParts.join('/')

                        // 找到這個檔案應該放哪個資料夾
                        const fileParent = folderMap.get(folderPath)


                        const result = await uploadSingleFile(
                            file,
                            fileParent,
                            item
                        )


                        item.status = result.type === 'success'
                            ? 'success'
                            : 'error'


                        results[index] = result

                    }catch(e){

                        console.log(e)

                        item.status = 'error'

                        results[index] = {
                            type:'error',
                            message:'檔案上傳失敗。'
                        }

                    }


                    completed++

                    progress.value = Math.round(
                        (completed / fileList.length) * 100
                    )

                }

            }


            const workers = []

            const workerCount = Math.min(
                concurrency,
                fileList.length
            )


            for(let i = 0; i < workerCount; i++){

                workers.push(worker())

            }


            await Promise.all(workers)

            await getData()

            return results


        }finally{

            uploading.value = false

        }

    }


    async function handleUploadFolder(event){

        const files = event.target.files

        if(!files?.length) return

        try{

            const results = await uploadFolder(
                files,
                currentParent.value,
                4
            )

            event.target.value = ''

            const failedCount = results.filter(item => {
                return item.type !== 'success'
            }).length

            if(failedCount){

                eventBus.emit('handleAlert',{
                    title:'資料夾上傳結果',
                    message:`${failedCount} 個檔案上傳失敗。`,
                    type:'error'
                })

            }else{

                eventBus.emit('handleAlert',{
                    title:'資料夾上傳結果',
                    message:'資料夾上傳成功。',
                    type:'success'
                })

            }

        }catch(e){

            console.log(e)

            event.target.value = ''

            eventBus.emit('handleAlert',{
                title:'資料夾上傳結果',
                message:'資料夾結構建立失敗。',
                type:'error'
            })

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