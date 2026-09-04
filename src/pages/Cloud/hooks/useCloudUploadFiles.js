import axios from 'axios'
import { ref } from 'vue'
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

                    item.progress = Math.round(
                        (event.loaded / event.total) * 100
                    )

                }
            }
        )

        return res.data

    }


    async function uploadFiles(files, parent, concurrency = 4){

        const fileList = Array.from(files)

        if(!fileList.length){
            return {
                results:[],
                failedFiles:[]
            }
        }

        uploading.value = true
        progress.value = 0

        uploadList.value = []


        // 建立上傳清單
        fileList.forEach(file => {

            uploadList.value.push({
                file,
                name:file.name,
                progress:0,
                status:'waiting',
                message:''
            })

        })


        const results = []

        let currentIndex = 0
        let completed = 0


        const worker = async () => {

            while(true){

                const index = currentIndex++

                if(index >= fileList.length) break

                const file = fileList[index]

                const item = uploadList.value[index]

                item.status = 'uploading'
                item.message = ''


                try{

                    const result = await uploadSingleFile(file, parent, item)

                    results[index] = {
                        file,
                        ...result
                    }


                    if(result.type === 'success'){

                        item.status = 'success'
                        item.progress = 100

                    }else{

                        item.status = 'error'
                        item.message = result.message || '檔案上傳失敗。'

                    }

                }catch(e){

                    console.log(e)

                    item.status = 'error'

                    item.message = e.response?.data?.message || e.message || '檔案上傳失敗。'


                    results[index] = {
                        file,
                        type:'error',
                        message:item.message
                    }

                }


                completed++

                progress.value = Math.round(
                    (completed / fileList.length) * 100
                )

            }

        }


        try{

            const workers = []

            const workerCount = Math.min(
                concurrency,
                fileList.length
            )


            for(let i = 0; i < workerCount; i++){
                workers.push(worker())
            }


            await Promise.all(workers)


            // 找出失敗檔案
            const failedFiles = uploadList.value.filter(item => {
                return item.status === 'error'
            })


            // 最後更新 Cloud 資料
            await getData()


            return {
                results,
                failedFiles
            }

        }finally{

            uploading.value = false

        }

    }


    async function handleUploadFiles(event){

        const files = event.target.files

        if(!files?.length) return

        const notification = ElNotification({ title: '資源上傳進度', message: '資源正在上傳中...', type: 'warning', showClose:false, duration: 0, position: 'bottom-right' })
        try{

            const { results, failedFiles } = await uploadFiles(
                files,
                currentParent.value,
                4
            )

            event.target.value = ''


            if(failedFiles.length){

                const failedMessage = failedFiles.map(item => {
                    return `${item.name}\n原因：${item.message}`
                }).join('\n\n')


                ElNotification({ title: '檔案上傳結果', message: `${failedFiles.length} 個檔案上傳失敗。\n\n${failedMessage}`, type: 'error', position: 'bottom-right' })

            }
            else{

                ElNotification({ title: '檔案上傳結果', message: '檔案上傳成功。', type:'success', position: 'bottom-right' })

            }

        }
        catch(e){

            console.log(e)

            event.target.value = ''

            ElNotification({ title: '檔案上傳結果', message: '檔案上傳失敗。', type:'error', position: 'bottom-right' })

        }
        finally{
            notification.close();
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

