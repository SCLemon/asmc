<template>
  <div class="view-wrapper">
    <div class="column">
      <column></column>
    </div>
    <div class="view_box">
      <div class="view" ref="view">
        <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Column from './components/Column/Column.vue';
import { ElNotification } from 'element-plus'
import { eventBus } from '@/utils/eventBus'
export default {
  name:'App',
  components:{
    Column
  },
  setup(){

    // 操作通知
    const alertHandler = (data)=>{
      const { title, message, type } = data;
      ElNotification({ title, message, type, duration: 1750 })
    }
    onMounted(()=>{
      eventBus.on('handleAlert', alertHandler)
    })
    onUnmounted(() => {
        eventBus.off('handleAlerte', alertHandler)
    })
  }
}
</script>

<style>
  .view-wrapper{
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .view_box{
    width: calc(100vw - 80px);
    min-width: 1140px;
    height: 100vh;
    box-sizing: border-box;
  }
  .view{
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .column{
    width: 80px;
    overflow-y: scroll;
    height: 100vh;
    box-sizing: border-box;
    flex-shrink: 0;
    box-shadow: 7.5px 0px 5px rgba(210,210,210);
  }

  *::-webkit-scrollbar{
    display: none;
  }
  
  *{
    font-family: "Inter", sans-serif;
  }


  .page-enter-active,
  .page-leave-active{
      transition:
          opacity .2s linear,
  }

  /* 新頁面：由下往上進場 */

  .page-enter-from{
      opacity: 0;
  }

  .page-enter-to{
      opacity: 1;
  }

  /* 舊頁面：往下退場 */

  .page-leave-from{
      opacity: 1;
  }

  .page-leave-to{
      opacity: 0;
  }
</style>