<template>
  <div class="second">
    <a-radio-group @change="onChange" v-model="type">
      <div class="second-item">
        <a-radio :style="radioStyle" :value="TYPE_EVERY" :disabled="disabled">每秒</a-radio>
      </div>

      <div class="second-item">
        <a-radio :style="radioStyle" :value="TYPE_RANGE" :disabled="disabled">
          区间:
          从
          <a-input-number :min="minValue" :max="maxValue" v-model="valueRange.start" :disabled="type!=TYPE_RANGE || disabled"/>秒 至
          <a-input-number :min="minValue" :max="maxValue" v-model="valueRange.end" :disabled="type!=TYPE_RANGE || disabled"/>秒
        </a-radio>
      </div>

      <div class="second-item">
        <a-radio :style="radioStyle" :value="TYPE_LOOP" :disabled="disabled">
          循环:
          从
          <a-input-number :min="minValue" :max="maxValue" v-model="valueLoop.start"  :disabled="type!=TYPE_LOOP || disabled" />秒开始，间隔
          <a-input-number :min="minValue" :max="maxValue" v-model="valueLoop.interval"  :disabled="type!=TYPE_LOOP || disabled" />秒
        </a-radio>
      </div>

      <div class="check-box second-item">
        <a-radio :style="radioStyle" :value="TYPE_SPECIFY" :disabled="disabled">指定</a-radio>
        <div class="check-list">
          <a-checkbox-group v-model="valueList" @change="onChangeBox">
            <a-row>
              <a-col :span="2" v-for="i in maxValue+1" :key="i-1">
                <a-checkbox :value="i-1" :disabled="type!=TYPE_SPECIFY || disabled">{{i-1}}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </div>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model,Watch } from "vue-property-decorator";
const TYPE_NOT_SET = 'TYPE_NOT_SET'
const TYPE_EVERY = 'TYPE_EVERY'
const TYPE_RANGE = 'TYPE_RANGE'
const TYPE_LOOP = 'TYPE_LOOP'
const TYPE_WORK = 'TYPE_WORK'
const TYPE_LAST = 'TYPE_LAST'
const TYPE_SPECIFY = 'TYPE_SPECIFY'

const DEFAULT_VALUE = '?'
@Component
export default class Second extends Vue {
  @Prop({
    type:Boolean,
    default: false
  }) disabled!: boolean

  @Prop({
    type:String,
    default: ''
  }) second!:any

  @Prop({
    type:String,
    default: '?'
  }) prop2!:any

  @Model('change') prop!: any

  type: string = "TYPE_EVERY"; //选择类型
  TYPE_EVERY: string = "TYPE_EVERY"; //每秒
  TYPE_RANGE: string = "TYPE_RANGE"; //区间
  TYPE_LOOP: string = "TYPE_LOOP"; //循环
  TYPE_SPECIFY: string = "TYPE_SPECIFY"; //指定
  DEFAULT_VALUE: string = "?"; //默认
  valueLast: any;
  valueWork:number =  1
  maxValue: number = 59;
  minValue: number = 0;
  valueRange = {
    start: 0,
    end: 59
  };

  valueLoop = {
    start: 0,
    interval: 1
  };

  valueList = [];
  radioStyle: any = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
    textAlign: "left"
  };

  created() {
    console.log(this.prop, 'prop')
    this.parseProp(this.prop)
  }

  //选择的值
  get value_c () {
    console.log(this.type,'this.type')
      let result = []
      switch (this.type) {
        case TYPE_NOT_SET:
          result.push('?')
          break
        case TYPE_EVERY:
          result.push('*')
          break
        case TYPE_RANGE:
          result.push(`${this.valueRange.start}-${this.valueRange.end}`)
          break
        case TYPE_LOOP:
          result.push(`${this.valueLoop.start}/${this.valueLoop.interval}`)
          break
        case TYPE_WORK:
          result.push(`${this.valueWork}W`)
          break
        case TYPE_LAST:
          result.push('L')
          break
        case TYPE_SPECIFY:
          result.push(this.valueList.join(','))
          break
        default:
          result.push(this.DEFAULT_VALUE)
          break
      }
      return result.length > 0 ? result.join('') : this.DEFAULT_VALUE
  }

  onChange(e: any) {
    console.log("radio checked", e.target.value);
   console.log(this.type,'this.type')
  }

  onChangeBox(checkedValues: any) {
    console.log("checked = ", checkedValues);
  }

  parseProp (value:any) {
      if (value === this.value_c) {
        // console.info('same ' + value)
        return
      }
      // if (typeof (this.preProcessProp) === 'function') {
      //   value = this.preProcessProp(value)
      // }
      try {
        if (!value || value === this.DEFAULT_VALUE) {
          this.type = TYPE_EVERY
        } else if (value.indexOf('?') >= 0) {
          this.type = TYPE_NOT_SET
        } else if (value.indexOf('-') >= 0) {
          this.type = TYPE_RANGE
          const values = value.split('-')
          if (values.length >= 2) {
            this.valueRange.start = parseInt(values[0])
            this.valueRange.end = parseInt(values[1])
          }
        } else if (value.indexOf('/') >= 0) {
          this.type = TYPE_LOOP
          const values = value.split('/')
          if (values.length >= 2) {
            this.valueLoop.start = value[0] === '*' ? 0 : parseInt(values[0])
            this.valueLoop.interval = parseInt(values[1])
          }
        } else if (value.indexOf('W') >= 0) {
          this.type = TYPE_WORK
          const values = value.split('W')
          if (!values[0] && !isNaN(values[0])) {
            this.valueWork = parseInt(values[0])
          }
        } else if (value.indexOf('L') >= 0) {
          this.type = TYPE_LAST
          const values = value.split('L')
          this.valueLast = parseInt(values[0])
        } else if (value.indexOf(',') >= 0 || !isNaN(value)) {
          this.type = TYPE_SPECIFY
          this.valueList = value.split(',').map((item:any) => parseInt(item))
        } else {
          this.type = TYPE_EVERY
        }
      } catch (e) {
        // console.info(e)
        this.type = TYPE_EVERY
      }
    }

  @Watch("prop",{
    immediate: true
  })
  propChange (v:any) {
     if (v === this.value_c) {
        // console.info('skip ' + newVal)
        return
      } 
      this.parseProp(v)
   }

  @Watch("value_c",{
    immediate: true
  })
  value_cChange (v:any) {
        console.info( v, ' + newVal')
    this.$emit('change', v)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.second-item {
  margin-bottom: 20px;
}
.check-box,.ant-radio-wrapper {
  display: flex;
}
</style>
