<template>
  <div class="hello">
    <Cron v-model="cronValue"/>
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
  public cronValue: any = "0/14 3 5 7-8 1 ?";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
