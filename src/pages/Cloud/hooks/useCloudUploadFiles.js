import axios from 'axios'
import { ref } from 'vue'
import jsCookie from 'js-cookie'
import { eventBus } from '../../../utils/eventBus';

export function useCloudUploadFiles(currentParent, getData) {

    const inputFileEl = ref(null)

    const uploading = ref(false)
    const progress = ref(0)

    function openUploadFiles(){

        if(inputFileEl.value){
            inputFileEl.value.click()
        }

    }

    async function uploadSingleFile(file, parent){

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
                    'x-user-token': jsCookie.get('authToken')
                }
            }
        )

        return res.data

    }

    async function uploadFiles(files, parent, concurrency = 4){

        const fileList = Array.from(files)

        if(!fileList.length) return []

        uploading.value = true
        progress.value = 0

        const results = []

        let currentIndex = 0
        let completed = 0

        const worker = async () => {

            while(true){

                const index = currentIndex++

                if(index >= fileList.length) break

                const file = fileList[index]

                try{

                    const result = await uploadSingleFile(
                        file,
                        parent
                    )

                    results[index] = {
                        file,
                        ...result
                    }

                }catch(e){

                    console.log(e)

                    results[index] = {
                        file,
                        type: 'error',
                        message: '檔案上傳失敗。'
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

            await getData()

            return results

        }finally{

            uploading.value = false

        }

    }

    async function handleUploadFiles(event){

        const files = event.target.files

        if(!files?.length) return

        const results = await uploadFiles(
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
                title:'檔案上傳結果',
                message:`${failedCount} 個檔案上傳失敗。`,
                type:'error'
            })

        }else{

            eventBus.emit('handleAlert',{
                title:'檔案上傳結果',
                message:'檔案上傳成功。',
                type:'success'
            })

        }

    }

    return {
        inputFileEl,
        uploading,
        progress,
        openUploadFiles,
        handleUploadFiles
    }

}