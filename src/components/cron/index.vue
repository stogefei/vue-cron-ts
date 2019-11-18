<template>
  <div class="cron-box">
    <div class="cron-wrapper">
      <div class="corn-left">
        <a-tabs defaultActiveKey="1" @change="callback" size="small">
          <a-tab-pane tab="秒" key="1">
            <SecondUi v-model="second"/>
          </a-tab-pane>
          <a-tab-pane tab="分" key="2" forceRender>
            <MinuteUi v-model="minute"/>
          </a-tab-pane>
          <a-tab-pane tab="时" key="3">
            <HourUi v-model="hour"/>
          </a-tab-pane>
          <a-tab-pane tab="日" key="4">
            <DayUi v-model="day" :week="week"/>
          </a-tab-pane>
          <a-tab-pane tab="月" key="5">
            <MonthUi v-model="month"/>
          </a-tab-pane>
          <a-tab-pane tab="周" key="6">
            <WeekUi v-model="week" :day="day"/>
          </a-tab-pane>
          <a-tab-pane tab="年" key="7">
            <YearUi v-model="year"/>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="corn-right">
        <div class="table-box">
          <a-table
            size="small"
            :columns="columns"
            :pagination="false"
            :dataSource="tableData"
            :rowKey="record => record.id"
          >
            <span slot="nameTitle" class="resize">类型</span>
            <span slot="valueTitle" class="resize">值</span>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model, Watch } from "vue-property-decorator";
import SecondUi from "./tabs/second.vue";
import MinuteUi from "./tabs/minute.vue";
import HourUi from "./tabs/hour.vue";
import DayUi from "./tabs/day.vue";
import MonthUi from "./tabs/month.vue";
import WeekUi from "./tabs/week.vue";
import YearUi from "./tabs/year.vue";
@Component({
  name: "Cron",
  components: {
    SecondUi,
    MinuteUi,
    HourUi,
    DayUi,
    MonthUi,
    WeekUi,
    YearUi
  }
})
export default class Cron extends Vue {
  @Prop({
    type: String,
    default: ""
  })
  public cronValue2!: any;

  @Model("change")
  public cronValue!: any;

  public columns: any = [
    {
      width: 60,
      fixed: "left",
      dataIndex: "name",
      align: "left",
      key: "0",
      slots: { title: "nameTitle" }
    },
    {
      dataIndex: "value",
      key: "1",
      slots: { title: "valueTitle" }
    }
  ];

  public second = "*";
  public minute = "*";
  public hour = "*";
  public day = "*";
  public month = "*";
  public week = "?";
  public year = "*";

  get tableData() {
    let c = [{ name: "秒", value: this.second, id: 0 }];
    c = c.concat([
      { name: "分", value: this.minute, id: 1 },
      { name: "时", value: this.hour, id: 2 },
      { name: "日", value: this.day, id: 3 },
      { name: "月", value: this.month, id: 4 },
      { name: "周", value: this.week, id: 5 }
    ]);
    return c.concat(
      { name: "年", value: this.year, id: 6 },
      { name: "表达式", value: this.cronValue_c, id: 7 }
    );
  }

  // 表达式
  get cronValue_c() {
    const result = [];
    result.push(this.second ? this.second : "*");
    result.push(this.minute ? this.minute : "*");
    result.push(this.hour ? this.hour : "*");
    result.push(this.day ? this.day : "*");
    result.push(this.month ? this.month : "*");
    result.push(this.week ? this.week : "?");
    result.push(this.year ? this.year : "*");
    return result.join(" ");
  }
  // 格式化
  public formatValue() {
    // console.info(this.cronValue)
    if (!this.cronValue) {
      return;
    }
    const values = this.cronValue.split(" ").filter((item: any) => !!item);
    if (!values || values.length <= 0) {
      return;
    }
    let i = 0;
    if (values.length > i) {
      this.second = values[i++];
    }
    if (values.length > i) {
      this.minute = values[i++];
    }
    if (values.length > i) {
      this.hour = values[i++];
    }
    if (values.length > i) {
      this.day = values[i++];
    }
    if (values.length > i) {
      this.month = values[i++];
    }
    if (values.length > i) {
      this.week = values[i++];
    }
    if (values.length > i) {
      this.year = values[i];
    }
  }

  public callback(key: any) {
    console.log(key);
  }

  public created() {
    console.log(this.cronValue, "cronValue-created");
  }

  @Watch("cronValue", {
    immediate: true
  })
  public cronValueChange(v: any) {
    console.log(v, "----------v");
    if (v === this.cronValue_c) {
      // console.info('same cron value: ' + newVal)
      return;
    }
    this.formatValue();
  }

  @Watch("cronValue_c")
  public cronValue_cChange(v: any) {
    this.$emit("change", v);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "./common-css/index.less";
</style>
