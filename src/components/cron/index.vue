<template>
  <div class="cron-box">
      <div class="corn-left">
       <a-tabs defaultActiveKey="1" @change="callback"  size="small">
          <a-tab-pane tab="秒" key="1">
            <SecondUi v-model="second" />
          </a-tab-pane>
          <a-tab-pane tab="分" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>
          <a-tab-pane tab="时" key="3">Content of Tab Pane 3</a-tab-pane>
          <a-tab-pane tab="日" key="4">Content of Tab Pane 4</a-tab-pane>
          <a-tab-pane tab="月" key="5">Content of Tab Pane 5</a-tab-pane>
          <a-tab-pane tab="周" key="6">Content of Tab Pane 6</a-tab-pane>
          <a-tab-pane tab="年" key="7">Content of Tab Pane 7</a-tab-pane>
        </a-tabs>
      </div>

      <div class="corn-right">
        <a-table 
           :columns="columns"
           :pagination="false"
           :dataSource="tableData">
          <span slot="nameTitle" class="resize"></span>
          <span slot="valueTitle" class="resize"></span>
        </a-table>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model,Watch } from 'vue-property-decorator';
import SecondUi from './tabs/second.vue'
@Component({
    name: "Cron",
    components: {
    SecondUi
    }
})
export default class Cron extends Vue {
  @Prop({
    type:String,
    default: ''
  }) cronValue2!: any

  @Model('change') cronValue!: any

  columns:any = [
      {  
       dataIndex: 'name',
       align: 'left',
       slots: { title: 'nameTitle' }
      },
      {
      dataIndex: 'value',
      slots: { title: 'valueTitle' }
    },
    ]

    second = '*'
    minute = '*'
    hour = '*'
    day = '*'
    month = '*'
    week = '?'
    year = '*'
 
    get tableData() {
      let  c = [{ name: '秒', value: this.second, id: 0}]
      c = c.concat([
        { name: '分', value: this.minute, id: 1 },
        { name: '时', value: this.hour, id: 2  },
        { name: '日', value: this.day, id: 3  },
        { name: '月', value: this.month, id: 4  },
        { name: '周', value: this.week, id: 5  }
      ])
      return  c.concat(
          { name: '年', value: this.year, id: 6 },
          { name: '表达式', value: this.cronValue_c, id: 7 }
        )
    }

    //表达式
    get  cronValue_c () {
      let result = []
      result.push(this.second ? this.second : '*')
      result.push(this.minute ? this.minute : '*')
      result.push(this.hour ? this.hour : '*')
      result.push(this.day ? this.day : '*')
      result.push(this.month ? this.month : '*')
      result.push(this.week ? this.week : '?')
      return result.join(' ')
    }
    //格式化
    formatValue () {
      // console.info(this.cronValue)
      if (!this.cronValue) return
      const values = this.cronValue.split(' ').filter((item:any) => !!item)
      if (!values || values.length <= 0) return
      let i = 0;
      if (values.length > i) this.second = values[i++]
      if (values.length > i) this.minute = values[i++]
      if (values.length > i) this.hour = values[i++]
      if (values.length > i) this.day = values[i++]
      if (values.length > i) this.month = values[i++]
      if (values.length > i) this.week = values[i++]
      if (values.length > i) this.year = values[i]
    }
 
    callback(key:any) {
          console.log(key);
    }

    created() {
      console.log(this.cronValue, 'cronValue-created')
    }

    @Watch("cronValue",{
      immediate: true
    })
    cronValueChange(v:any) {
      console.log(v,'----------v')
      if (v === this.cronValue_c) {
          // console.info('same cron value: ' + newVal)
          return
        }
      this.formatValue()
    }

    @Watch("cronValue_c")
      cronValue_cChange (v:any) {
      this.$emit('change', v)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.cron-box{
  margin: 0 auto;
  width:800px;
  display: flex;
}
.corn-left{
  width: 500px;
}
.corn-right{
  flex: 1 0 auto;
}
</style>
