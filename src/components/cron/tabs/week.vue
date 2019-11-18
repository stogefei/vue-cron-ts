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
                <a-radio :style="radioStyle" :value="TYPE_EVERY" :disabled="disableChoice">每月</a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_RANGE" :disabled="disableChoice">
                    区间:
                    从
                    <a-select
                        style="width: 120px"
                        v-model="valueRange.start"
                        :disabled="type!=TYPE_RANGE || disableChoice"
                    >
                        <a-select-option v-for="(v, k) of WEEK_MAP" :value="v" :key="v">{{ k }}</a-select-option>
                    </a-select>至
                    <a-select
                        style="width: 120px"
                        v-model="valueRange.end"
                        :disabled="type!=TYPE_RANGE || disableChoice"
                    >
                        <a-select-option v-for="(v, k) of WEEK_MAP" :value="v" :key="v">{{ k }}</a-select-option>
                    </a-select>
                </a-radio>
            </div>
            <div class="wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_LOOP" :disabled="disableChoice">
                    循环:
                    从
                    <a-select
                        style="width: 120px"
                        v-model="valueRange.start"
                        :disabled="type!=TYPE_LOOP || disableChoice"
                    >
                        <a-select-option v-for="(v, k) of WEEK_MAP" :value="v" :key="k">{{ k }}</a-select-option>
                    </a-select>开始，间隔
                    <a-input-number
                        :min="minValue"
                        :max="maxValue"
                        v-model="valueLoop.interval"
                        :disabled="type!=TYPE_LOOP || disableChoice"
                    />天
                </a-radio>
            </div>
            <div class="check-box wrapper-item">
                <a-radio :style="radioStyle" :value="TYPE_SPECIFY" :disabled="disableChoice">指定</a-radio>
                <div class="check-list">
                    <a-checkbox-group v-model="valueList" @change="onChangeBox">
                        <a-row>
                            <a-col :span="4" v-for="(i, index) in WEEK_MAP" :key="index">
                                <a-checkbox
                                    :value="i"
                                    :disabled="type!=TYPE_SPECIFY || disableChoice"
                                >{{index}}</a-checkbox>
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
import { replaceWeekName } from "../utils/replace";
@Component({
  mixins: [CronMixin]
})
export default class Week extends mixins(CronMixin) {
  @Prop({
    type: String,
    default: "*"
  })
  public day!: any;

  public WEEK_MAP: any = {
    周日: 0,
    周一: 1,
    周二: 2,
    周三: 3,
    周四: 4,
    周五: 5,
    周六: 6
  };
  public created() {
    this.DEFAULT_VALUE = "*";
    // 0,7表示周日 1表示周一
    this.minValue = 0;
    this.maxValue = 6;
    this.valueRange.start = 0;
    this.valueRange.end = 6;
    this.valueLoop.start = 2;
    this.valueLoop.interval = 1;
    this.parseProp(this.prop);
  }
  get disableChoice() {
    console.log(this.day, "this.day");
    return (this.day && this.day !== "?") || this.disabled;
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
  public preProcessProp(c: any) {
    return replaceWeekName(c);
  }

  @Watch("value_c", {
    immediate: true
  })
  public value_cChange(v: any) {
    console.info(v, " + newVal");
    this.$emit("change", v);
  }

  @Watch("day", {
    immediate: true
  })
  public dayChange(v: any) {
    this.updateValue();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../common-css/index.less";
</style>