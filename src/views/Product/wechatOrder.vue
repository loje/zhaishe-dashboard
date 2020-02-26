<template>
  <div class="product-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>产品列表</el-breadcrumb-item>
          <el-breadcrumb-item>微信支付订单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-date-picker
          v-model="billDate"
          type="date"
          placeholder="选择对账日期">
        </el-date-picker>
        <el-button type="primary" @click="downloadbill" style="margin-left: 15px;">查询</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="tradingTime"
          label="交易时间"
          width='160'>
        </el-table-column>
        <!-- <el-table-column
          prop="officialAccounts"
          label="公众账号ID"
          width='170'>
        </el-table-column> -->
        <!-- <el-table-column
          prop="specialMerchantNo"
          label="特约商户号"
          width='90'>
        </el-table-column> -->
        <!-- <el-table-column
          prop="deviceNumber"
          label="设备号">
        </el-table-column> -->
        <el-table-column
          prop="weChatOrderNumber"
          label="微信订单号"
          width='160'>
        </el-table-column>
        <el-table-column
          prop="merchantOrderNo"
          label="商户订单号"
          width='160'>
        </el-table-column>
        <el-table-column
          prop="userID"
          label="用户标识"
          width='160'>
        </el-table-column>
        <!-- <el-table-column
          prop="tradeType"
          label="交易类型">
        </el-table-column> -->
        <el-table-column
          prop="tradeStatus"
          label="交易状态"
          width='100'>
          <template slot-scope="scope">
            <span v-if="scope.row.tradeStatus === 'SUCCESS'">支付成功</span>
            <span v-else-if="scope.row.tradeStatus === 'REFUND'">转入退款</span>
            <span v-else-if="scope.row.tradeStatus === 'REVOKED'">已撤销</span>
            <span v-else>{{scope.row.tradeStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payingBank"
          label="付款银行">
        </el-table-column>
        <el-table-column
          prop="currencyType"
          label="货币种类">
        </el-table-column>
        <el-table-column
          prop="settlementAmount"
          label="应结订单金额">
        </el-table-column>
        <!-- <el-table-column
          prop="voucherAmount"
          label="代金券金额">
        </el-table-column> -->
        <el-table-column
          prop="weChatRefundNumber"
          label="微信退款单号">
        </el-table-column>
        <el-table-column
          prop="merchantRefundNo"
          label="商户退款单号">
        </el-table-column>
        <el-table-column
          prop="refundAmount"
          label="退款金额">
        </el-table-column>
        <!-- <el-table-column
          prop="refundableVouchersAmount"
          label="充值券退款金额">
        </el-table-column> -->
        <el-table-column
          prop="refundType"
          label="退款类型">
          <template slot-scope="scope">
            <span v-if="scope.row.refundType === 'ORIGINAL'">原路退款</span>
            <span v-else-if="scope.row.refundType === 'BALANCE'">转退微信零钱</span>
            <span v-else>{{scope.row.refundType}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundStatus"
          label="退款状态">
          <template slot-scope="scope">
            <span v-if="scope.row.refundStatus === 'SUCCES'">退款成功</span>
            <span v-else-if="scope.row.refundStatus === 'FAIL'">退款失败</span>
            <span v-else-if="scope.row.refundStatus === 'PROCESSING'">退款处理中</span>
            <span v-else>{{scope.row.refundStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称">
        </el-table-column>
        <!-- <el-table-column
          prop="merchantPacket"
          label="商户数据包">
        </el-table-column> -->
        <el-table-column
          prop="poundage"
          label="手续费">
        </el-table-column>
        <el-table-column
          prop="rate"
          label="费率">
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          label="订单金额">
        </el-table-column>
        <el-table-column
          prop="applyRefundAmount"
          label="申请退款金额">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5';
import xml2js from 'xml2js';
export default {
  data() {
    return {
      loading: false,
      tableData: [],

      billDate: '',
    }
  },
  activated() {
    this.billDate = `${new Date()}`;
    this.downloadbill();
  },
  methods: {
    // 生成随机字符
    randomString(length, chars) {
      let result = '';
      for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
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
    downloadbill() {
      const that = this;
      const yy = new Date(this.billDate).getFullYear();
      const mm = new Date(this.billDate).getMonth() + 1 < 10 ? '0' + (new Date(this.billDate).getMonth() + 1) : (new Date(this.billDate).getMonth() + 1);
      const dd = new Date(this.billDate).getDate() < 10 ? '0' + new Date(this.billDate).getDate() : new Date(this.billDate).getDate();

      const appid = 'wx34c87ef5d4d802d9';
      const mch_id = '1570704211';
      const nonce_str = this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      const bill_date = `${yy}${mm}${dd}`;
      const bill_type = 'ALL';

      const stringA = `appid=${appid}&bill_date=${bill_date}&bill_type=${bill_type}&mch_id=${mch_id}&nonce_str=${nonce_str}`;
      const stringSignTemp = stringA + "&key=5f99609225b2944c2e230ade0fa99cc9"; //注：key为商户平台设置的密钥key
      const sign = md5(stringSignTemp).toUpperCase();

      const formData = `<xml>
      <appid>${appid}</appid>
      <bill_date>${bill_date}</bill_date>
      <bill_type>${bill_type}</bill_type>
      <mch_id>${mch_id}</mch_id>
      <nonce_str>${nonce_str}</nonce_str>
      <sign>${sign}</sign>
      </xml>`;

      let param = {
        funcName: 'downloadbill',
        data: {
          formData,
        }
      };
      this.$Bmob.functions(param.funcName, param.data).then((resultData) => {
        if (resultData.indexOf('交易时间') !== -1) {
          const arr = [];
          for (let i = 1; i < resultData.split('`').length - 8; i += 1) {
            arr.push(resultData.split('`')[i]);
          }
          const values = [];
          for (let i = 0, len = arr.length; i < len; i+=27 ){
            values.push(arr.slice(i , i + 27));
          }
          const keys = resultData.split('`')[0].split(',');
          for (let a = 0; a < values.length; a += 1) {
            const jsonData = {};
            for (let x = 0; x < keys.length; x += 1) {
              if (values[a][x]) {
                values[a][x] = values[a][x].replace(',', '');
              }
              if (keys[x] === '﻿交易时间') {
                jsonData.tradingTime = values[a][x];
              }
              if (keys[x] === '公众账号ID') {
                jsonData.officialAccounts = values[a][x];
              }
              if (keys[x] === '商户号') {
                jsonData.merchantNo = values[a][x];
              }
              if (keys[x] === '特约商户号') {
                jsonData.specialMerchantNo = values[a][x];
              }
              if (keys[x] === '设备号') {
                jsonData.deviceNumber = values[a][x];
              }
              if (keys[x] === '微信订单号') {
                jsonData.weChatOrderNumber = values[a][x];
              }
              if (keys[x] === '商户订单号') {
                jsonData.merchantOrderNo = values[a][x];
              }
              if (keys[x] === '用户标识') {
                jsonData.userID = values[a][x];
              }
              if (keys[x] === '交易类型') {
                jsonData.tradeType = values[a][x];
              }
              if (keys[x] === '交易状态') {
                jsonData.tradeStatus = values[a][x];
              }
              if (keys[x] === '付款银行') {
                jsonData.payingBank = values[a][x];
              }
              if (keys[x] === '货币种类') {
                jsonData.currencyType = values[a][x];
              }
              if (keys[x] === '应结订单金额') {
                jsonData.settlementAmount = values[a][x];
              }
              if (keys[x] === '代金券金额') {
                jsonData.voucherAmount = values[a][x];
              }
              if (keys[x] === '微信退款单号') {
                jsonData.weChatRefundNumber = values[a][x];
              }
              if (keys[x] === '商户退款单号') {
                jsonData.merchantRefundNo = values[a][x];
              }
              if (keys[x] === '退款金额') {
                jsonData.refundAmount = values[a][x];
              }
              if (keys[x] === '充值券退款金额') {
                jsonData.refundableVouchersAmount = values[a][x];
              }
              if (keys[x] === '退款类型') {
                jsonData.refundType = values[a][x];
              }
              if (keys[x] === '退款状态') {
                jsonData.refundStatus = values[a][x];
              }
              if (keys[x] === '商品名称') {
                jsonData.productName = values[a][x];
              }
              if (keys[x] === '商户数据包') {
                jsonData.merchantPacket = values[a][x];
              }
              if (keys[x] === '手续费') {
                jsonData.poundage = values[a][x];
              }
              if (keys[x] === '费率') {
                jsonData.rate = values[a][x];
              }
              if (keys[x] === '订单金额') {
                jsonData.orderAmount = values[a][x];
              }
              if (keys[x] === '申请退款金额') {
                jsonData.applyRefundAmount = values[a][x];
              }
            }
            this.tableData.push(jsonData);
          }
        } else {
          this.tableData = [];
          // xml转json格式
          xml2js.parseString(resultData, function (err, json) {
            if (err) {
              new Error("解析xml报错")
            } else {
              var result = that.formMessage(json.xml); // 转换成正常的json 数据
              console.log(result.return_msg) //打印出返回的结果
              if (result.return_msg === 'No Bill Exist') {
                that.$message.warning('账单不存在');
              } else {
                that.$message.warning(result.return_msg);
              }
              // return result;
            }
          });
        }
      });
    },


    getlist() {
      this.loading = true;
      let proList = [];
      let userList = [];

      let orderQuery = this.$Bmob.Query('order_list');

      orderQuery.equalTo('sort', '===', 'product');
      orderQuery.find().then((res) => {
        this.loading = false;
        let list = res;

        let productQuery = this.$Bmob.Query('product');
        productQuery.find().then((prores) => {
          proList = prores;
          let userQuery = this.$Bmob.Query('_User');
          userQuery.find().then((userres) => {
            userList = userres;

            for (let i = 0; i < list.length; i += 1) {
              for (let j = 0; j < proList.length; j += 1) {
                if (list[i].product.objectId === proList[j].objectId) {
                  list[i].productName = proList[j].title;

                  for (let k = 0; k < userList.length; k += 1) {
                    if (list[i].user.objectId === userList[k].objectId) {
                      console.log(userList[k]);
                      list[i].userInfo = userList[k];

                      list[i] = {
                        ...list[i],
                        ...list[i].payReslut,
                      };
                    }
                  }
                }
              }
            }
            this.tableData = list;
          });
        });
      });
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
</style>
