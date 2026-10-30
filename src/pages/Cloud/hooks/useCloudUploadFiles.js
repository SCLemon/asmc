import axios from 'axios'
import { ref, h, watch } from 'vue'
import jsCookie from 'js-cookie'
import { ElNotification } from 'element-plus'
import { compressImage } from '../../../utils/compressor'

export function useCloudUploadFiles(currentParent, getData) {
    const inputFileEl = ref(null)
    const uploading = ref(false)
    const progress = ref(0)
    const uploadSpeed = ref(0)
    const uploadList = ref([])

    function openUploadFiles() {
        if (inputFileEl.value) {
            inputFileEl.value.click()
        }
    }

    // 自動轉換上傳速度單位
    function formatUploadSpeed(speed) {
        if (speed < 1) {
            return `${(speed * 1024).toFixed(2)} KB/s`
        }
        if (speed >= 1024) {
            return `${(speed / 1024).toFixed(2)} GB/s`
        }
        return `${speed.toFixed(2)} MB/s`
    }

    function downloadErrorLog(failedFiles, filename = 'upload_error_log.txt') {
        const logContent = failedFiles.map(item => {
            return `name: ${item.name}, reason: ${item.message}`
        }).join('\n')

        const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)
    }

    async function uploadSingleFile(file, parent, item) {
        let fileToUpload = file

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

        if (parent) {
            formData.append('parent', parent)
        }

        let lastLoaded = 0
        let lastTime = 0

        item.speed = 0
        uploadSpeed.value = 0

        const res = await axios.post('/api/cloud/user/upload', formData, {
            headers: {
                'x-user-token': jsCookie.get('authToken')
            },
            onUploadProgress: (event) => {
                if (!event.total) return

                const now = performance.now()

                item.percent = Math.round((event.loaded / event.total) * 100)

                if (lastTime === 0) {
                    lastLoaded = event.loaded
                    lastTime = now
                    return
                }

                const elapsedSeconds = (now - lastTime) / 1000

                if (elapsedSeconds >= 0.1 || event.loaded === event.total) {
                    const uploadedBytes = event.loaded - lastLoaded

                    if (elapsedSeconds > 0) {
                        const speed = uploadedBytes / elapsedSeconds / (1024 * 1024)

                        item.speed = Math.max(0, speed)
                        uploadSpeed.value = item.speed
                    }

                    lastLoaded = event.loaded
                    lastTime = now
                }
            }
        })

        return res.data
    }

    async function uploadFiles(files, parent, onProgress) {
        const fileList = Array.from(files)

        if (!fileList.length) return []

        uploading.value = true
        progress.value = 0
        uploadSpeed.value = 0
        uploadList.value = []

        fileList.forEach(file => {
            uploadList.value.push({
                item: file,
                name: file.name,
                percent: 0,
                status: 'waiting',
                message: '',
                speed: 0
            })
        })

        let completed = 0

        try {
            for (let index = 0; index < fileList.length; index++) {
                const file = fileList[index]
                const item = uploadList.value[index]

                item.status = 'uploading'
                item.percent = 0
                item.message = ''
                item.speed = 0

                try {
                    const result = await uploadSingleFile(file, parent, item)

                    if (result.type === 'success') {
                        item.status = 'success'
                        item.percent = 100
                        item.message = ''
                    } else {
                        item.status = 'error'
                        item.message = result.message || '檔案上傳失敗。'
                    }
                } catch (e) {
                    console.error(e)

                    item.status = 'error'
                    item.message = e.response?.data?.message || e.message || '檔案上傳失敗。'
                }

                completed++

                progress.value = Math.round((completed / fileList.length) * 100)

                if (onProgress) {
                    onProgress(completed, fileList.length)
                }
            }

            await getData()

            return uploadList.value
        } finally {
            uploading.value = false
        }
    }

    async function handleUploadFiles(event) {
        const files = event.target.files

        if (!files?.length) return

        const progressText = ref(`資源正在上傳中 (0/${files.length})...`)

        const NotificationContent = {
            setup() {
                return () => h('div', {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }
                }, [
                    h('span', {
                        style: {
                            flex: '1'
                        }
                    }, progressText.value),

                    h('span', {
                        style: {
                            fontSize: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            color: '#409eff'
                        }
                    }, formatUploadSpeed(uploadSpeed.value))
                ])
            }
        }

        const notification = ElNotification({
            title: '資源上傳進度',
            message: h(NotificationContent),
            type: 'warning',
            showClose: false,
            duration: 0,
            position: 'bottom-right'
        })

        const stopSpeedWatch = watch(uploadSpeed, (newSpeed) => {
            console.log(`目前上傳速度：${formatUploadSpeed(newSpeed)}`)
        })

        try {
            await uploadFiles(files, currentParent.value, (completed, total) => {
                progressText.value = `資源上傳中 (${completed}/${total})...`
            })

            event.target.value = ''

            const failedFiles = uploadList.value.filter(item => item.status === 'error')

            if (failedFiles.length) {
                downloadErrorLog(failedFiles)
            }

            ElNotification({
                title: '檔案上傳結果',
                message: '所有檔案處理完畢。',
                type: 'success',
                position: 'bottom-right'
            })
        } catch (e) {
            console.error(e)

            event.target.value = ''

            ElNotification({
                title: '檔案上傳結果',
                message: '檔案上傳失敗。',
                type: 'error',
                position: 'bottom-right'
            })
        } finally {
            stopSpeedWatch()
            notification.close()
            uploadSpeed.value = 0
        }
    }

    return {
        inputFileEl,
        uploading,
        progress,
        uploadSpeed,
        uploadList,
        openUploadFiles,
        handleUploadFiles
    }
}
