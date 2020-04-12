<template>
  <div class="product-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>产品列表</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <div class="input-group">
          <span>购买用户：</span>
          <el-select v-model="userId" filterable clearable>
            <el-option :value="item.objectId" :label="item.username" v-for="(item, $index) in userList" :key="$index"></el-option>
          </el-select>
        </div>
        <div class="input-group">
          <span>发货状态：</span>
          <el-select v-model="delivery" clearable>
            <el-option :value="1" label="未发货"></el-option>
            <el-option :value="2" label="已发货"></el-option>
          </el-select>
        </div>
        <!-- <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          style="margin-left: 30px;">
        </el-date-picker> -->
        <el-button type="primary" @click="getlist" style="margin-left: 5px;">查询</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        :default-sort = "{prop: 'time_end', order: 'descending'}">
        <el-table-column
          label="序号"
          min-width="60">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="订单号"
          prop="objectId"
          min-width="150">
          <template slot-scope="scope">
            <span style="color: #999;">PRO-</span><span style="text-transform: uppercase">{{scope.row.objectId}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="商户订单号"
          prop="out_trade_no"
          min-width="160">
        </el-table-column>
        <el-table-column
          label="订单金额(元)"
          prop="total_fee"
          min-width="110">
          <template slot-scope="scope">
            {{(scope.row.payReslut ? scope.row.payReslut.total_fee / 100 : 0).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          label="支付状态"
          prop="trade_state_desc"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.payReslut ? scope.row.payReslut.trade_state_desc : ''}}
          </template>
        </el-table-column>
        <el-table-column
          label="相关产品"
          prop="productName"
          min-width="200">
          <template slot-scope="scope">
          <div class="media" v-if="scope.row.product">
            <div class="media-left">
              <div class="media-img" :style="{backgroundImage: `url(${scope.row.product.imgSrc})`}"></div>
            </div>
            <div class="media-body">
              <div class="media-title">
                {{scope.row.product.title}}
              </div>
            </div>
          </div>
          </template>
        </el-table-column>
        <el-table-column
          label="购买用户"
          min-width="200">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover">
              <div style="margin-bottom: 10px;"><span style="color:#999;">微信号：</span>
              {{scope.row.wechatId ? scope.row.wechatId : (scope.row.user && scope.row.user.wechatId ? scope.row.user.wechatId : '暂无微信号')}}
              </div>
              <div style="margin-bottom: 10px;"><span style="color:#999;">电话：</span>
              {{scope.row.phone ? scope.row.phone : (scope.row.user && scope.row.user.mobilePhoneNumber ? scope.row.user.mobilePhoneNumber : '暂无手机号')}}
              </div>
              <div style="margin-bottom: 10px;"><span style="color:#999;">姓名：</span>
              {{scope.row.name ? scope.row.name : (scope.row.user && scope.row.user.name ? scope.row.user.name : '暂无名字')}}
              </div>
              <div><span style="color:#999;">邮箱：</span>
              {{scope.row.email ? scope.row.email : (scope.row.user && scope.row.user.email ? scope.row.user.email : '暂无邮箱')}}
              </div>
              <span slot="reference" style="white-space: nowrap;">
                <div :style="{display: 'inline-block',  backgroundImage: `url(${scope.row.user.imgSrc})`, width: '18px', height: '18px', backgroundSize: 'cover', verticalAlign: 'middle', borderRadius: '50%'}" v-if="!scope.row.username && scope.row.user"></div>
                <span style="display: inline-block;margin-left: 5px;">{{scope.row.username ? scope.row.username : (scope.row.user && scope.row.user.username ? scope.row.user.username : '暂无用户名')}}</span>
              </span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="推荐码"
          min-width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.couponCode">
              <el-tag type="warning">{{scope.row.couponCode}}</el-tag>
            </template>
            <template v-else>
              <span style="color: #999;font-size: 12px;">未使用推荐码</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="订单备注"
          prop="remark"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="购买时间"
          prop="time_end"
          min-width="160">
        </el-table-column>
        <el-table-column label="发货操作" align="center" min-width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="comfilmDelivery(scope.row.objectId)" v-if="!scope.row.delivery">确认发货</el-button>
            <el-button type="info" size="small" @click="cancelDelivery(scope.row.objectId)" v-else>取消发货</el-button>
          </template>
        </el-table-column>
        <el-table-column label="订单操作" align="center" min-width="100">
          <template slot-scope="scope">
            <el-button size="small" @click="checkWechatOrder(scope.row)" style="color: #00c250;border-color: #00c250;">微信对账</el-button>
            <!-- <el-button size="small" @click="refund(scope.row.payReslut)" style="color: #F56C6C;border-color: #F56C6C;">申请退款</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 20, 50, 100, 1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>


    <el-dialog title="微信对账" :visible.sync="dialogVisible" width="30%">
      <template v-if="form.trade_state === 'SUCCESS'">
        <el-form :model="form">
          <el-form-item label="微信支付订单号：" label-width="100">{{form.transaction_id}}</el-form-item>
          <el-form-item label="商户订单号：" label-width="100">{{form.out_trade_no}}</el-form-item>
          <el-form-item label="支付完成时间：" label-width="100">{{form.time_end.substring(0, 4)}}-{{form.time_end.substring(4, 6)}}-{{form.time_end.substring(6, 8)}} {{form.time_end.substring(8, 10)}}:{{form.time_end.substring(10, 12)}}:{{form.time_end.substring(12, 14)}}</el-form-item>
          <el-form-item label="交易状态描述：" label-width="100">{{form.trade_state_desc}}</el-form-item>
          <el-form-item label="订单金额：" label-width="100">{{(form.total_fee / 100).toFixed(2)}}</el-form-item>
        </el-form>
      </template>
      <template v-if="!form.trade_state && form.return_code === 'SUCCESS'">
        <el-form :model="form">
          <el-form-item label="退款笔数：" label-width="100">{{form.refund_count}}</el-form-item>
          <el-form-item label="微信支付订单号：" label-width="100">{{form.transaction_id}}</el-form-item>
          <el-form-item label="商户订单号：" label-width="100">{{form.out_trade_no}}</el-form-item>
          <el-form-item label="订单金额：" label-width="100">{{form.total_fee / 100}}</el-form-item>
        </el-form>
      </template>
    </el-dialog>

    <el-dialog title="申请退款" :visible.sync="refundVisible" width="30%">
      <el-form :model="refundForm" :rules="refundRules" ref="refundform">
        <el-form-item label="交易单号" label-width="100px">{{refundForm.transaction_id}}</el-form-item>
        <el-form-item label="商户单号" label-width="100px">{{refundForm.out_trade_no}}</el-form-item>
        <el-form-item label="订单金额" label-width="100px">{{refundForm.total_fee / 100}}</el-form-item>
        <el-form-item label="退款金额" label-width="100px" prop="refund_fee">
          <el-input-number v-model="refundForm.refund_fee" controls-position="right" :min="0.01" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="退款原因" label-width="100px" prop="refund_desc">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入退款原因"
            v-model="refundForm.refund_desc">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfilmRefund">提交申请</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5';
import xml2js from 'xml2js';

export default {
  data() {
    return {
      dateTime: '',
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const start = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`).getTime();
            const end = start + 24 * 60 * 60 * 1000 - 1000;
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

      delivery: '',
      pageSize: 50,
      skip: 0,
      tableData: [],
      loading: false,
      current: 1,
      total: 0,

      form: {},
      dialogVisible: false,

      refundForm: {
        refund_fee: 0.01,
      },
      refundVisible: false,
      refundRules: {
        refund_fee: [{required: true, message: '请输入退款金额', trigger: 'blur' }],
      },

      userList: [],
      userId: '',
    }
  },
  activated() {
    const start = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`).getTime();
    const end = start + 24 * 60 * 60 * 1000 - 1000;
    this.dateTime = [start, end];
    this.getlist();

    this.getUserList();
  },
  methods: {
    getlist() {
      this.loading = true;
      let ppQuery = this.$Bmob.Query('order_list');
      const skip = this.pageSize * (this.current - 1);
      ppQuery.limit(this.pageSize);
      ppQuery.skip(skip);
      ppQuery.order('-createdAt');
      ppQuery.equalTo("sort", "==", 'product');
      if (this.userId) {
        const pointer = this.$Bmob.Pointer('_User')
        const poiID = pointer.set(this.userId)
        ppQuery.equalTo("user", "==", poiID);
      }
      if (this.delivery) {
        if (this.delivery === 1) {
          ppQuery.equalTo("delivery", "==", false);
        } else if (this.delivery === 2) {
          ppQuery.equalTo("delivery", "==", true);
        }
      }
      ppQuery.include('user', 'user');
      ppQuery.find().then((res) => {
        this.loading = false;
        let list = res;

        let productQuery = this.$Bmob.Query('product');
        productQuery.find().then((prolist) => {
          for (let i = 0; i < list.length; i += 1) {
            const time_end = list[i].payReslut && list[i].payReslut.time_end ? list[i].payReslut.time_end : '';
            const time = list[i].payReslut && list[i].payReslut.time_end ? `${time_end.substring(0, 4)}-${time_end.substring(4, 6)}-${time_end.substring(6, 8)} ${time_end.substring(8, 10)}:${time_end.substring(10, 12)}:${time_end.substring(12, 14)}` : '';
            list[i] = {
              ...list[i],
              out_trade_no: list[i].payReslut && list[i].payReslut.out_trade_no ? list[i].payReslut.out_trade_no : '',
              time_end: time,
            };

            for (let j = 0; j < prolist.length; j += 1) {
              if (list[i].product && list[i].product.objectId === prolist[j].objectId) {
                list[i].productName = prolist[j].title;
                list[i].product = prolist[j];
              }
            }
          }
          this.tableData = list;
          this.getOrderCount();
        });
      });

    },
    getOrderCount() {
      let orderQuery = this.$Bmob.Query('order_list');
      orderQuery.order('-createdAt');
      orderQuery.equalTo('sort', '===', 'product');
      if (this.delivery) {
        if (this.delivery === 1) {
          orderQuery.equalTo("delivery", "==", false);
        } else if (this.delivery === 2) {
          orderQuery.equalTo("delivery", "==", true);
        }
      }
      orderQuery.count().then((count) => {
        this.total = count;
        localStorage.setItem('orderCount', count);
      });
    },
    handleSizeChange(page) {
      this.current = 1;
      this.pageSize = page;
      this.getlist();
    },
    handleCurrentChange(current) {
      this.current = current;
      this.getlist();
    },
    comfilmDelivery(id) {
      const query = this.$Bmob.Query('order_list');
      query.set('id', id); //需要修改的objectId
      query.set('delivery', true);
      query.save().then(() => {
        this.getlist();
      });
    },
    cancelDelivery(id) {
      const query = this.$Bmob.Query('order_list');
      query.set('id', id); //需要修改的objectId
      query.set('delivery', false);
      query.save().then(() => {
        this.getlist();
      });
    },

    formMessage(result) {
      const that = this;
      var message = {};
      if (typeof result === 'object') {
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) {
          var item = result[keys[i]];
          var key = keys[i];
          if (!(item instanceof Array) || item.length === 0) {
            continue;
          }
          if (item.length === 1) {
            var val = item[0];
            if (typeof val === 'object') {
              message[key] = this.formMessage(val);
            } else {
              message[key] = (val || '').trim();
            }
          } else {
            message[key] = [];
            for (var j = 0, k = item.length; j < k; j++) {
              message[key].push(that.formMessage(item[j]));
            }
          }
        }
      }
      return message;
    },
    // 生成随机字符
    randomString(length, chars) {
      let result = '';
      for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    },
    checkWechatRefund(item) {
      const that = this;

      const appid = 'wx34c87ef5d4d802d9';
      const mch_id = '1570704211';
      const nonce_str = this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

      const stringA = `appid=${appid}&mch_id=${mch_id}&nonce_str=${nonce_str}&transaction_id=${item.transaction_id}`;
      const stringSignTemp = stringA + "&key=5f99609225b2944c2e230ade0fa99cc9"; //注：key为商户平台设置的密钥key
      const sign = md5(stringSignTemp).toUpperCase();

      const formData = `<xml>
      <appid>${appid}</appid>
      <mch_id>${mch_id}</mch_id>
      <nonce_str>${nonce_str}</nonce_str>
      <out_refund_no></out_refund_no>
      <out_trade_no></out_trade_no>
      <refund_id></refund_id>
      <transaction_id>${item.transaction_id}</transaction_id>
      <sign>${sign}</sign>
      </xml>`;

      let param = {
        funcName: 'refundquery',
        data: {
          formData,
        }
      };
      this.$Bmob.functions(param.funcName, param.data).then((resultData) => {
        // xml转json格式
        xml2js.parseString(resultData, function (err, json) {
          if (err) {
            new Error("解析xml报错")
          } else {
            var result = that.formMessage(json.xml); // 转换成正常的json 数据
            console.log(result) //打印出返回的结果
            that.form = result;
          }
        })
      });
    },
    checkWechatOrder(item) {
      const that = this;
      this.dialogVisible = true;

      const appid = 'wx34c87ef5d4d802d9';
      const mch_id = '1570704211';
      const nonce_str = this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

      const stringA = `appid=${appid}&mch_id=${mch_id}&nonce_str=${nonce_str}&out_trade_no=${item.payReslut.out_trade_no}`;
      const stringSignTemp = stringA + "&key=5f99609225b2944c2e230ade0fa99cc9"; //注：key为商户平台设置的密钥key
      const sign = md5(stringSignTemp).toUpperCase();

      const formData = `<xml>
      <appid>${appid}</appid>
      <mch_id>${mch_id}</mch_id>
      <nonce_str>${nonce_str}</nonce_str>
      <out_trade_no>${item.payReslut.out_trade_no}</out_trade_no>
      <sign>${sign}</sign>
      </xml>`;

      let param = {
        funcName: 'orderquery',
        data: {
          formData,
        }
      };
      this.$Bmob.functions(param.funcName, param.data).then((resultData) => {
        // xml转json格式
        xml2js.parseString(resultData, function (err, json) {
          if (err) {
            new Error("解析xml报错")
          } else {
            var result = that.formMessage(json.xml); // 转换成正常的json 数据
            console.log(JSON.stringify(result)) //打印出返回的结果
            if (result.trade_state === 'SUCCESS') {
              that.form = result;
            }
            if (result.trade_state === 'REFUND') {
              that.checkWechatRefund(item.payReslut);
            }
            const orderquery = that.$Bmob.Query('order_list');
            orderquery.set('id', item.objectId);
            orderquery.set("payReslut", result);
            orderquery.save().then(() => {
              that.getlist();
            });
            // orderquery.get(item.objectId).then(() => {
            //   orderquery.set("payReslut", result);
            //   orderquery.save();
            // });
            console.log(item.objectId);
          }
        })
      });
    },

    refund(item) {
      this.refundVisible = true;
      this.refundForm = item;
    },
    comfilmRefund() {
      // const that = this;
      this.$refs.refundform.validate((valid) => {
        if (valid) {
          const appid = 'wx34c87ef5d4d802d9';
          const mch_id = '1570704211';
          const nonce_str = this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

          const stringA = `appid=${appid}&mch_id=${mch_id}&nonce_str=${nonce_str}&out_trade_no=${this.refundForm.out_trade_no}&refund_fee=${this.refundForm.refund_fee * 100}&total_fee=${this.refundForm.total_fee}`;
          const stringSignTemp = stringA + "&key=5f99609225b2944c2e230ade0fa99cc9"; //注：key为商户平台设置的密钥key
          const sign = md5(stringSignTemp).toUpperCase();

          const formData = `<xml>
          <appid>${appid}</appid>
          <mch_id>${mch_id}</mch_id>
          <nonce_str>${nonce_str}</nonce_str>
          <out_trade_no>${this.refundForm.out_trade_no}</out_trade_no>
          <refund_fee>${this.refundForm.refund_fee * 100}</refund_fee>
          <total_fee>${this.refundForm.total_fee}</total_fee>
          <sign>${sign}</sign>
          </xml>`;

          let param = {
            funcName: 'refund',
            data: {
              formData,
            }
          };
          this.$Bmob.functions(param.funcName, param.data).then((error, res, body) => {
            console.log(error, res, body);
            // xml转json格式
            // xml2js.parseString(resultData, function (err, json) {
            //   if (err) {
            //     new Error("解析xml报错")
            //   } else {
            //     var result = that.formMessage(json.xml); // 转换成正常的json 数据
            //     console.log(JSON.stringify(result)) //打印出返回的结果
            //   }
            // });
          });
        }
      });
    },

    getUserList() {
      // this.loading = true;
      // const that = this;
      var userListQuery = this.$Bmob.Query('_User');
      userListQuery.order("-loginTime");
      userListQuery.find().then((res) => {
        // that.loading = false;
        // that.userList = [];
        // for (let i = 0; i < res.length; i += 1) {
        //   for (let key in res[i].loginTime) {
        //     if (key === 'iso') {
        //       res[i].loginTime = res[i].loginTime[key];
        //     }
        //   }
        //   const longTime = parseInt((new Date().getTime() - new Date(res[i].createdAt).getTime()) / 1000 / 60 / 60 / 24);
        //   const longHours = parseInt((new Date().getTime() - new Date(res[i].createdAt).getTime()) / 1000 / 60 / 60);
        //   if (longTime > 0) {
        //     res[i].longTime = longTime
        //   } else {
        //     res[i].longHours = longHours
        //   }

        //   that.tableData.push(res[i]);
        // }
        this.userList = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .page-top {
    position: relative;
    margin-bottom: 15px;
    padding: 15px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    .top-title {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      color: #999;
      .el-breadcrumb {
        line-height: 40px;
      }
    }
    .top-func {
      position: absolute;
      top: 15px;
      right: 25px;
      .add-btn {
        width: 120px;
      }
      .input-group {
        margin-left: 15px;
        display: inline-block;
      }
    }
  }
  .layer-table {
    padding: 15px;
    width: 100%;
    height: calc(100% - 133px);
    background-color:#fff;
    overflow: auto;
    box-sizing: border-box;
    .table-func {
      text-align: right;
    }
    .el-table td div {
      font-size: 14px;
    }
    .el-table::before {
      background-color: #fff;
    }
    .title {
      font-size: 12px;
    }
  }
  .pagination {
    padding: 0 50px;
    width: 100%;
    height: 50px;
    text-align: right;
    background-color:#fff;
    box-sizing: border-box;
  }
  .media {
    display: flex;
    width: 230px;
    .media-left {
      padding-right: 5px;
      .media-img {
        width: 24px;
        height: 24px;
        background-size: cover;
      }
      .media-body {
        flex: 1;
        .media-title {
          font-size: 13px;
          line-height: 24px;
          color: #999;
        }
      }
    }
  }
</style>
