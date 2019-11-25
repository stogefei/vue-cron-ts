<template>
  <div class="hello">
    <Cron v-model="cronValue"/>
    <div style="width:70%;margin:0 auto">
      <h3>检验表达式</h3>
      <a-input placeholder='输入表达式' v-model="cronValue2"></a-input>
      <br/>
      <br/>
      <a-button type='primary' @click="test" block>检验</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Cron from "./cron/index.vue";
@Component({
  name: "HelloWorld",
  components: {
    Cron
  }
})
export default class HelloWorld extends Vue {
  public cronValue: any = "";
  public cronValue2: any = "";

  test() {
    this.cronValue = this.cronValue2
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
