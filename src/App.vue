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
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import Column from './components/Column/Column.vue';

export default {
  name:'App',
  components:{
    Column
  },
  setup(){
      const view = ref();
      const route = useRoute();
      watch(()=>route.path, (newVal) => {

          const target = view.value;
          if(!target) return;
          target.scrollTo({top: 0, behavior: 'smooth'})

      }, { immediate: true })

      return {
        view
      }
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
    box-sizing: border-box;
    padding-bottom: 20px;
    overflow-y: auto;
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
          opacity .4s ease,
          transform .4s ease;
  }

  /* 新頁面：由下往上進場 */

  .page-enter-from{
      opacity: 0;
      transform: translateY(50px);
  }

  .page-enter-to{
      opacity: 1;
      transform: translateY(0);
  }

  /* 舊頁面：往下退場 */

  .page-leave-from{
      opacity: 1;
      transform: translateY(0);
  }

  .page-leave-to{
      opacity: 0;
      transform: translateY(50px);
  }
</style>