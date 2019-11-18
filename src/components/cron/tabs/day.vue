<template>
    <div class="wrapper">
        <a-radio-group v-model="type" @chang="onChange">
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_NOT_SET" :disabled="disableChoice">
                    不设置
                    <span class="tip-info">日和周只能设置其中之一</span>
                </a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_EVERY" :disabled="disableChoice">每日</a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_RANGE" :disabled="disableChoice">
                    区间:
                    从
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        v-model="valueRange.start"
                        :precision="0"
                        :disabled="type!=TYPE_RANGE || disableChoice"
                    />日 至
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        v-model="valueRange.end"
                        :precision="0"
                        :disabled="type!=TYPE_RANGE || disableChoice"
                    />日
                </a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_LOOP" :disabled="disableChoice">
                    循环:
                    从
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        v-model="valueLoop.start"
                        :precision="0"
                        :disabled="type!=TYPE_LOOP || disableChoice"
                    />号开始，间隔
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        :precision="0"
                        v-model="valueLoop.interval"
                        :disabled="type!=TYPE_LOOP || disableChoice"
                    />天
                </a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_WORK" :disabled="disableChoice">
                    工作日:
                    本月
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        :precision="0"
                        v-model="valueWork"
                        :disabled="type!=TYPE_WORK || disableChoice"
                    />日，最近的工作日
                </a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_LAST" :disabled="disableChoice">最后一日</a-radio>
            </div>
            <div class="check-box wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_SPECIFY" :disabled="disableChoice">指定</a-radio>
                <div class="check-list">
                    <a-checkbox-group v-model="valueList" @change="onChangeBox">
                        <a-row>
                            <a-col :span="2" v-for="i in maxValue" :key="i">
                                <a-checkbox
                                    :value="i"
                                    :disabled="type!=TYPE_SPECIFY || disableChoice"
                                >{{i}}</a-checkbox>
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
export default class Day extends mixins(CronMixin) {
  @Prop({
    type: String,
    default: "?"
  })
  public week!: any;

  public created() {
    console.log(this.prop, "prop");
    this.DEFAULT_VALUE = "*";
    this.minValue = 1;
    this.maxValue = 31;
    this.valueRange.start = 1;
    this.valueRange.end = 31;
    this.valueLoop.start = 1;
    this.valueLoop.interval = 1;
    this.parseProp(this.prop);
  }

  public onChange(e: any) {
    console.log("radio checked", e.target.value);
  }

  public onChangeBox(checkedValues: any) {
    console.log("checked = ", checkedValues);
  }

  public updateValue() {
    this.$emit("change", this.disableChoice ? "?" : this.value_c);
  }

  get disableChoice() {
    return (this.week && this.week !== "?") || this.disabled;
  }

  @Watch("value_c", {
    immediate: true
  })
  public value_cChange(v: any) {
    console.info(v, " + value_c");
    this.updateValue();
  }

  @Watch("week", {
    immediate: true
  })
  public weekChange(v: any) {
    console.info(v, " + weekChange");
    this.updateValue();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../common-css/index.less";
</style>