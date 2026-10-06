<template>
  <div class="file-preview-container">
    <div class="file-preview-close-button" @click="closePreview()">
        <VIcon :icon="CloseIcon" :size="30"></VIcon>
    </div>
    <div v-if="loading" class="state-message">資源預覽載入中...</div>
    <div v-else-if="error" class="state-message error-message">{{ errorMessage }}</div>
    <div v-else class="preview-content">
        <div v-if="fileType === 'image'" class="image-wrapper"><img :src="previewSrc" alt="預覽圖" class="preview-image" /></div>
        <vue-office-docx v-else-if="fileType === 'docx'" :src="previewSrc" class="docx-viewer" @rendered="onRenderSuccess" @error="onRenderError" />
        <div  class="xlsx-viewer-wrapper" v-else-if="fileType === 'xlsx'"><vue-office-excel class="xlsx-viewer" :src="previewSrc"  @rendered="onRenderSuccess" @error="onRenderError" /></div>
        <div v-else-if="fileType === 'pdf'" class="pdf-viewer-wrapper"><VPdfViewer :pdfFile="pdfFile" /></div>
        <div v-else class="state-message">不支援此檔案格式預覽（{{ fileType || '未知格式' }}）</div>
    </div>
  </div>
</template>

<script>
import { ref, h, watch, nextTick, onBeforeUnmount } from 'vue'
import axios from 'axios'
import jsCookie from 'js-cookie'
import { ElNotification } from 'element-plus'
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import { VPdfViewer } from 'vorium-ui'
import 'vorium-ui/dist/vorium-ui.css'
import '@vue-office/excel/lib/index.css'
import '@vue-office/docx/lib/index.css'

import { VIcon } from 'vorium-ui'
import { CloseIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

export default {
  name: 'FilePreview',
    components: { 
        VueOfficeDocx, VueOfficeExcel, VPdfViewer, VIcon
    },
    props: {
        url: { 
            type: String, 
            required: true 
        },
    },
  setup(props, context) {
    const loading = ref(false)
    const error = ref(false)
    const errorMessage = ref('')
    const fileType = ref('')
    const previewSrc = ref(null)
    const pdfFile = ref(null)


    const revokePreviewSrc = () => {
        if (previewSrc.value && typeof previewSrc.value === 'string' && previewSrc.value.startsWith('blob:')) {
            URL.revokeObjectURL(previewSrc.value)
        }
    }

    const detectFileType = (mime = '', name = '') => {
      const type = mime.toLowerCase(), filename = name.toLowerCase()
      if (type.includes('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(filename)) return 'image'
      if (type.includes('pdf') || filename.endsWith('.pdf')) return 'pdf'
      if (type.includes('wordprocessingml.document') || type.includes('docx') || filename.endsWith('.docx')) return 'docx'
      if (type.includes('spreadsheetml.sheet') || type.includes('xlsx') || filename.endsWith('.xlsx')) return 'xlsx'
      return 'unknown'
    }

    const fetchFile = async (url) => {
        if (!url) return
        loading.value = true
        error.value = false
        errorMessage.value = ''
        pdfFile.value = null
        revokePreviewSrc()

        try {
            const response = await axios.get(url, {
                responseType: 'blob',
                headers: { 'x-user-token': jsCookie.get('authToken') }
            })

            const blob = response.data
            const contentType = response.headers['content-type'] || blob.type || ''
            fileType.value = detectFileType(contentType, props.fileName || url)

            if (fileType.value === 'unknown') {
                error.value = true
                errorMessage.value = `暫不支援此檔案格式預覽 (${contentType || '未知'})`
                return
            }

            if (fileType.value === 'image') {
                previewSrc.value = URL.createObjectURL(blob)
            } 
            else if (fileType.value === 'pdf') {
                const pdfName = props.fileName || 'preview.pdf'
                const fileObj = new File([blob], pdfName, { type: 'application/pdf' })

                loading.value = false
                await nextTick()

                pdfFile.value = fileObj
            } 
            else {
                previewSrc.value = await blob.arrayBuffer()
            }
        } 
        catch (e) {
            error.value = true
            errorMessage.value = '資源預覽失敗'
            ElNotification({ title: '資源預覽結果', message: '資源預覽失敗', type: 'error', position: 'bottom-right' })
        } 
        finally {

            if (fileType.value !== 'pdf') {
                loading.value = false
            }
        }
    }

    function closePreview(){
        context.emit('close-preview')
    }

    function onRenderSuccess(){
        loading.value = false
    }
    function onRenderError(){
         error.value = true; 
         errorMessage.value = '解析失敗' 
    }
    watch(() => props.url, (newUrl) => fetchFile(newUrl), { immediate: true })

    onBeforeUnmount(() => revokePreviewSrc())

    return {
        loading, error, errorMessage, fileType, previewSrc, pdfFile, closePreview, onRenderSuccess, onRenderError, CloseIcon
    }
  }
}
</script>

<style scoped>
.file-preview-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}
.file-preview-close-button{
    position: absolute;
    width: 50px;
    height: 50px;
    color: white;
    top: 20px;
    right: 30px;
    display: flex;
    justify-content: center;
    align-content: center;
}
.file-preview-close-button:hover{
    cursor: pointer;
}
.preview-content {
    width: 100%;
    height: 100%;
    flex: 1;
}

/* docx */
.docx-viewer {
    width: 100%;
    height: 100%;
}

/* xlsx */
.xlsx-viewer-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.xlsx-viewer{
    width: 85%;
    height: 65%;
}

/* pdf */
.pdf-viewer-wrapper {
    width: 60%;
    height: 100%;
    margin: 0 auto;
    margin-top: 20px;
    flex: 1;
}

/* image */
.image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
}

.preview-image {
    max-width: 100%;
    max-height: 80%;
    object-fit: contain;
}

.state-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: 300px;
    font-size: 15px;
    color: #606266;
}

.error-message {
    color: white;
}

:deep(.docx-wrapper){
    background: transparent;
}
</style>