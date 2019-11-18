<template>
    <div class="wrapper">
        <a-radio-group v-model="type" @chang="onChange">
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_EVERY" :disabled="disabled">每时</a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_RANGE" :disabled="disabled">
                    区间:
                    从
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        :precision="0"
                        v-model="valueRange.start"
                        :disabled="type!=TYPE_RANGE || disabled"
                    />时 至
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        :precision="0"
                        v-model="valueRange.end"
                        :disabled="type!=TYPE_RANGE || disabled"
                    />时
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
                    />时开始，间隔
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        :precision="0"
                        v-model="valueLoop.interval"
                        :disabled="type!=TYPE_LOOP || disabled"
                    />时
                </a-radio>
            </div>
            <div class="check-box wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_SPECIFY" :disabled="disabled">指定</a-radio>
                <div class="check-list">
                    <a-checkbox-group v-model="valueList" @change="onChangeBox">
                        <a-row>
                            <a-col :span="2" v-for="i in maxValue+1" :key="i-1">
                                <a-checkbox
                                    :value="i-1"
                                    :disabled="type!=TYPE_SPECIFY || disabled"
                                >{{i-1}}</a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </div>
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
export default class Hour extends mixins(CronMixin) {
  public created() {
    console.log(this.prop, "prop");
    this.DEFAULT_VALUE = "*";
    this.minValue = 0;
    this.maxValue = 23;
    this.valueRange.start = 0;
    this.valueRange.end = 59;
    this.valueLoop.start = 0;
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