<template>
    <div class="wrapper">
        <a-radio-group v-model="type" @chang="onChange">
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_EVERY" :disabled="disabled">每年</a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_RANGE" :disabled="disabled">
                    区间:
                    从
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        v-model="valueRange.start"
                        :precision="0"
                        :disabled="type!=TYPE_RANGE || disabled"
                    />年 至
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        v-model="valueRange.end"
                        :precision="0"
                        :disabled="type!=TYPE_RANGE || disabled"
                    />年
                </a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_LOOP" :disabled="disabled">
                    循环:
                    从
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        v-model="valueLoop.start"
                        :precision="0"
                        :disabled="type!=TYPE_LOOP || disabled"
                    />年开始，间隔
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        v-model="valueLoop.interval"
                        :precision="0"
                        :disabled="type!=TYPE_LOOP || disabled"
                    />年
                </a-radio>
            </div>
        </a-radio-group>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import CronMixin from "../mixins/common";
@Component({
  mixins: [CronMixin]
})
export default class Year extends mixins(CronMixin) {
  public created() {
    const nowYear = new Date().getFullYear();
    this.DEFAULT_VALUE = "*";
    this.minValue = 0;
    this.maxValue = 10000;
    this.valueRange.start = nowYear;
    this.valueRange.end = nowYear + 100;
    this.valueLoop.start = nowYear;
    this.valueLoop.interval = 1;
    this.parseProp(this.prop);
  }
  public onChange(e: any) {
    console.log("radio checked", e.target.value);
  }

  public onChangeBox(checkedValues: any) {
    console.log("checked = ", checkedValues);
  }

  @Watch("value_c", {
    immediate: true
  })
  public value_cChange(v: any) {
    console.info(v, " + newVal");
    this.$emit("change", v);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../common-css/index.less";
</style>