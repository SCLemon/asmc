import axios from 'axios'
import { ref, h } from 'vue'
import jsCookie from 'js-cookie'
import { ElNotification } from 'element-plus'

export function useCloudUploadFiles(currentParent, getData) {

    const inputFileEl = ref(null)

    const uploading = ref(false)
    const progress = ref(0)

    const uploadList = ref([])


    function openUploadFiles(){

        if(inputFileEl.value){
            inputFileEl.value.click()
        }

    }


    function downloadErrorLog(failedFiles, filename = 'upload_error_log.txt'){

        const logContent = failedFiles.map(item => {
            return `name: ${item.name}, reason: ${item.message}`
        }).join('\n')

        const blob = new Blob([logContent], { type:'text/plain;charset=utf-8' })

        const link = document.createElement('a')

        link.href = URL.createObjectURL(blob)

        link.download = filename

        link.click()

        URL.revokeObjectURL(link.href)

    }


    async function uploadSingleFile(file, parent, item){

        const formData = new FormData()

        formData.append('file', file)

        if(parent){
            formData.append('parent', parent)
        }

        const res = await axios.post(
            '/api/cloud/user/upload',
            formData,
            {
                headers:{
                    'x-user-token':jsCookie.get('authToken')
                },
                onUploadProgress:(event) => {

                    if(!event.total) return

                    item.percent = Math.round(
                        (event.loaded / event.total) * 100
                    )

                }
            }
        )

        return res.data

    }


    async function uploadFiles(files, parent, onProgress){

        const fileList = Array.from(files)

        if(!fileList.length){
            return []
        }

        uploading.value = true
        progress.value = 0

        uploadList.value = []


        // 建立上傳清單
        fileList.forEach(file => {

            uploadList.value.push({
                item:file,
                name:file.name,
                percent:0,
                status:'waiting',
                message:''
            })

        })


        let completed = 0


        try{

            for(let index = 0; index < fileList.length; index++){

                const file = fileList[index]

                const item = uploadList.value[index]

                item.status = 'uploading'
                item.percent = 0
                item.message = ''


                try{

                    const result = await uploadSingleFile(file, parent, item)


                    if(result.type === 'success'){
                        item.status = 'success'
                        item.percent = 100
                    }
                    else{
                        item.status = 'error'
                        item.message = result.message || '檔案上傳失敗。'
                    }

                }
                catch(e){

                    console.log(e)

                    item.status = 'error'
                    item.message = e.response?.data?.message || e.message || '檔案上傳失敗。'

                }


                completed++

                progress.value = Math.round((completed / fileList.length) * 100)

                if(onProgress){
                    onProgress(completed, fileList.length)
                }

            }

            // 所有檔案完成後更新 Cloud
            await getData()
            
            return uploadList.value

        }
        finally{

            uploading.value = false

        }

    }


    async function handleUploadFiles(event){

        const files = event.target.files

        if(!files?.length) return

        const progressText = ref(`資源正在上傳中 (0/${files.length})...`)

        const notification = ElNotification({ 
            title: '資源上傳進度', 
            message: () => h('span', progressText.value), 
            type: 'warning', 
            showClose:false, 
            duration: 0, 
            position: 'bottom-right' 
        })

        try{

            await uploadFiles(files, currentParent.value, (completed, total) => {
                progressText.value = `資源正在上傳中 (${completed}/${total})...`
            })

            event.target.value = ''


            const failedFiles = uploadList.value.filter(item => {
                return item.status === 'error'
            })


            if(failedFiles.length) downloadErrorLog(failedFiles)
            ElNotification({ title: '資料夾上傳結果', message: '資料夾上傳完畢。', type:'success', position: 'bottom-right' })

        }
        catch(e){

            console.log(e)

            event.target.value = ''

            ElNotification({ title: '檔案上傳結果', message: '檔案上傳失敗。', type:'error', position: 'bottom-right' })

        }
        finally{

            notification.close()

        }

    }


    return {
        inputFileEl,
        uploading,
        progress,
        uploadList,
        openUploadFiles,
        handleUploadFiles
    }

}