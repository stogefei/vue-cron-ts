import { Component, Vue, Watch, Model, Prop } from "vue-property-decorator";
const TYPE_NOT_SET = "TYPE_NOT_SET";
const TYPE_EVERY = "TYPE_EVERY";
const TYPE_RANGE = "TYPE_RANGE";
const TYPE_LOOP = "TYPE_LOOP";
const TYPE_WORK = "TYPE_WORK";
const TYPE_LAST = "TYPE_LAST";
const TYPE_SPECIFY = "TYPE_SPECIFY";

const DEFAULT_VALUE = "?";

@Component
export default class CronMixin extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  public disabled!: boolean;

  @Prop({
    type: String,
    default: ""
  })
  public second!: any;

  @Prop({
    type: String,
    default: "?"
  })
  public prop2!: any;

  @Model("change") public prop!: any;

  public radioStyle: any = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
    textAlign: "left"
  };

  public type: string = "TYPE_EVERY"; // 选择类型
  public TYPE_EVERY: string = "TYPE_EVERY"; // 每秒
  public TYPE_RANGE: string = "TYPE_RANGE"; // 区间
  public TYPE_LOOP: string = "TYPE_LOOP"; // 循环
  public TYPE_SPECIFY: string = "TYPE_SPECIFY"; // 指定
  public TYPE_NOT_SET: string = "TYPE_NOT_SET"; // 指定
  public TYPE_WORK: string = "TYPE_WORK"; // TYPE_WORK
  public TYPE_LAST: string = "TYPE_LAST"; // TYPE_LAST
  public DEFAULT_VALUE: string = "?"; // 默认
  public valueLast: any;
  public valueWork: number = 1;
  public maxValue: number = 0;
  public minValue: number = 0;
  public maxDay: number = 31;
  public valueRange = {
    start: 0,
    end: 59
  };

  public valueLoop = {
    start: 0,
    interval: 1
  };
  // checked的值
  public valueList = [];

  // 选择的值
  get value_c() {
    const result: any = [];
    switch (this.type) {
      case TYPE_NOT_SET:
        result.push("?");
        break;
      case TYPE_EVERY:
        result.push("*");
        break;
      case TYPE_RANGE:
        result.push(`${this.valueRange.start}-${this.valueRange.end}`);
        break;
      case TYPE_LOOP:
        result.push(`${this.valueLoop.start}/${this.valueLoop.interval}`);
        break;
      case TYPE_WORK:
        result.push(`${this.valueWork}W`);
        break;
      case TYPE_LAST:
        result.push("L");
        break;
      case TYPE_SPECIFY:
        const sortArr = this.valueList.sort((a, b) => {
          return a - b;
        });
        console.log(sortArr, "sortArr");
        result.push(sortArr.join(","));
        break;
      default:
        result.push(this.DEFAULT_VALUE);
        break;
    }
    return result.length > 0 ? result.join("") : this.DEFAULT_VALUE;
  }

  public parseProp(value: any): void {
    if (value === this.value_c) {
      // console.info('same ' + value)
      return;
    }
    // if (typeof this.preProcessProp === "function") {
    //   value = this.preProcessProp(value);
    // }
    try {
      if (!value || value === this.DEFAULT_VALUE) {
        this.type = TYPE_EVERY; // 所有
      } else if (value.indexOf("?") >= 0) {
        this.type = TYPE_NOT_SET; // 不设置
      } else if (value.indexOf("-") >= 0) {
        this.type = TYPE_RANGE; // 范围
        const values = value.split("-");
        if (values.length >= 2) {
          // tslint:disable-next-line:radix
          this.valueRange.start = parseInt(values[0], 10);
          this.valueRange.end = parseInt(values[1], 10);
        }
      } else if (value.indexOf("/") >= 0) {
        this.type = TYPE_LOOP; // 循环
        const values = value.split("/");
        if (values.length >= 2) {
          this.valueLoop.start = value[0] === "*" ? 0 : parseInt(values[0], 10);
          this.valueLoop.interval = parseInt(values[1], 10);
        }
      } else if (value.indexOf("W") >= 0) {
        this.type = TYPE_WORK; // 工作日
        const values = value.split("W");
        console.log(values[0], 'values[0]');
        console.log(isNaN(values[0]));
        // console.log(!isNaN(values[0]), '!isNaN(values[0])')
        if (values[0] && !isNaN(values[0])) {
          this.valueWork = parseInt(values[0], 10);
        }
      } else if (value.indexOf("L") >= 0) {
        this.type = TYPE_LAST; // 最后要给工作日
        const values = value.split("L");
        this.valueLast = parseInt(values[0], 10);
      } else if (value.indexOf(",") >= 0 || !isNaN(value)) {
        this.type = TYPE_SPECIFY; // 指定值
        console.log(this.valueList, "this.valueList");
        this.valueList = value
          .split(",")
          .map((item: any) => parseInt(item, 10));
      } else {
        this.type = TYPE_EVERY;
      }
    } catch (e) {
      // console.info(e)
      this.type = TYPE_EVERY;
    }
  }

  @Watch("prop", {
    immediate: true
  })
  public propChange(v: any) {
    if (v === this.value_c) {
      // console.info('skip ' + newVal)
      return;
    }
    this.parseProp(v);
  }
}
