<template>
  <div class="applicants">
    <div class="page-top">
      <div class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/activity' }">活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>查看已报名人</el-breadcrumb-item>
          <el-breadcrumb-item v-loading="loading">{{$route.query.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-func">
        <el-select v-model="selectVal" placeholder="请选择" clearable style="width: 100px;">
          <el-option label="名字" value="name"></el-option>
          <el-option label="电话" value="phone"></el-option>
          <el-option label="微信" value="wechatId"></el-option>
          <el-option label="邮箱" value="email"></el-option>
        </el-select>
        <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getlist"></el-button>
        </el-input>
      </div>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%;border-bottom:1px solid #EBEEF5;"
        v-loading="loading"
        :span-method="objectSpanMethod"
        border
      >
        <el-table-column label="序号" prop="index" width="60">
          <template slot-scope="scope">{{(scope.$index + 1) + (current - 1) * pageSize}}</template>
        </el-table-column>
        <el-table-column label="订单号" prop="index" width="200">
          <template slot-scope="scope">{{scope.row.order.payReslut.out_trade_no}}</template>
        </el-table-column>

        <el-table-column label="购买用户" align="left" width="150">
          <template slot-scope="scope">
            <div style="white-space: nowrap;">
              <div
                :style="{display: 'inline-block',  backgroundImage: `url(${scope.row.user.imgSrc})`, width: '18px', height: '18px', backgroundSize: 'cover', verticalAlign: 'middle', borderRadius: '50%'}"
                v-if="!scope.row.nickname && scope.row.user"
              ></div>
              <span
                style="display: inline-block;margin-left: 5px;"
              >{{scope.row.user.nickname || scope.row.user.username}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="受赠用户" align="left">
          <template slot-scope="scope">
            <span
              v-if="scope.row.owner && (scope.row.owner.nickname || scope.row.owner.username)"
            >{{scope.row.owner.nickname || scope.row.owner.username}}</span>
            <el-button type="text" @click="setOwner(scope.row)" size="mini">受赠用户</el-button>
          </template>
        </el-table-column>
        <el-table-column label="名字" prop="name" align="center">
          <template slot-scope="scope">{{scope.row.order.name}}</template>
        </el-table-column>
        <el-table-column label="电话" prop="mobilePhoneNumber" align="center" min-width="100">
          <template slot-scope="scope">{{scope.row.order.phone}}</template>
        </el-table-column>
        <el-table-column label="微信" prop="wechatId" align="center">
          <template slot-scope="scope">{{scope.row.order.wechatId}}</template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" align="center" min-width="120">
          <template slot-scope="scope">{{scope.row.order.email}}</template>
        </el-table-column>
        <el-table-column label="报名时间" prop="createTime" align="center" min-width="120">
          <template slot-scope="scope">{{scope.row.order.createdAt}}</template>
        </el-table-column>

        <el-table-column label="支付金额" prop="total_fee" align="right" min-width="100">
          <template slot-scope="scope">
            {{(scope.row.order.payReslut.total_fee / 100).toFixed(2) || ''}}
            <span
              style="color: #999;font-size: 12px;"
            >
              (
              <span v-if="scope.row.order.attrName">（{{scope.row.order.attrName}}）x</span>
              {{scope.row.order.buyerCount}}张
              )
            </span>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" prop="trade_state_desc" align="center" min-width="100">
          <template slot-scope="scope">
            {{scope.row.order.payReslut.trade_state_desc || ''}}
            <el-button
              size="small"
              @click="checkWechatOrder(scope.row)"
              style="color: #00c250;border-color: #00c250;"
              v-if="scope.row.order.payReslut.trade_state_desc"
            >微信对账</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="320">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="comfilmChecked(scope.row.objectId)"
              v-if="scope.row.isChecked === false || !scope.row.isChecked"
            >验票作废</el-button>
            <el-button
              type="info"
              size="small"
              @click="cancelChecked(scope.row.objectId)"
              v-else
            >取消作废</el-button>
            <el-button
              type="primary"
              size="small"
              @click="comfilmWechat(scope.row.objectId)"
              v-if="scope.row.isWechat === false"
            >确认加微信</el-button>
            <el-button
              type="info"
              size="small"
              @click="cancelWechat(scope.row.objectId)"
              v-else
            >取消加微信</el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-close"
              @click="cancel(scope.row.objectId)"
              v-if="scope.row.isApply === true"
            >取消报名</el-button>
            <el-button
              type="info"
              size="small"
              icon="el-icon-check"
              @click="replace(scope.row.objectId)"
              v-else
            >再次报名</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="微信对账" :visible.sync="dialogVisible" width="30%">
      <template v-if="form.trade_state === 'SUCCESS'">
        <el-form :model="form">
          <el-form-item label="微信支付订单号：" label-width="100">{{form.transaction_id}}</el-form-item>
          <el-form-item label="商户订单号：" label-width="100">{{form.out_trade_no}}</el-form-item>
          <el-form-item
            label="支付完成时间："
            label-width="100"
          >{{form.time_end.substring(0, 4)}}-{{form.time_end.substring(4, 6)}}-{{form.time_end.substring(6, 8)}} {{form.time_end.substring(8, 10)}}:{{form.time_end.substring(10, 12)}}:{{form.time_end.substring(12, 14)}}</el-form-item>
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

    <el-dialog title="设置受赠用户" :visible.sync="dialogOwnerVisible" width="600px">
      <el-card shadow="hover" style="margin-bottom: 10px;">
        <div slot="header" class="clearfix">
          <span>当前选择</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="usercurrentRow = '';"
          >清空选择</el-button>
        </div>
        <template v-if="usercurrentRow">
          {{usercurrentRow.objectId}} -
          <span style="white-space: nowrap;">
            <div
              :style="{display: 'inline-block',  backgroundImage: `url(${usercurrentRow.imgSrc})`, width: '18px', height: '18px', backgroundSize: 'cover', verticalAlign: 'middle', borderRadius: '50%'}"
            ></div>
            <span
              style="display: inline-block;margin-left: 5px;"
            >{{usercurrentRow.nickname || usercurrentRow.username}}</span>
          </span>
        </template>
        <template v-else>
          <span style="color: #999;font-size:12px">请选择受赠用户，不选择默认取消受赠用户</span>
        </template>
      </el-card>
      <el-divider>✂</el-divider>
      <el-input placeholder="请输入微信昵称/用户名" v-model="usersearchText" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
      <el-table :data="userList" highlight-current-row @current-change="handleUserRowChange">
        <el-table-column label="序号" prop="index" width="60">
          <template slot-scope="scope">{{(scope.$index + 1) + (usercurrent - 1) * userpageSize}}</template>
        </el-table-column>
        <el-table-column prop="objectId" label="objectId"></el-table-column>
        <el-table-column label="微信昵称">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.unionid"
              placement="left-start"
            >
              <div style="white-space: nowrap;">
                <div
                  :style="{display: 'inline-block',  backgroundImage: `url(${scope.row.imgSrc})`, width: '18px', height: '18px', backgroundSize: 'cover', verticalAlign: 'middle', borderRadius: '50%'}"
                ></div>
                <span
                  style="display: inline-block;margin-left: 5px;"
                >{{scope.row.nickname || scope.row.username}}</span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          small
          :current-page="usercurrent"
          :page-sizes="[5, 10, 20]"
          :page-size="userpageSize"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="usertotal"
          @size-change="handleUserSizeChange"
          @current-change="handleUserCurrentChange"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOwnerVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOwner">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import md5 from "js-md5";
import xml2js from "xml2js";

export default {
  data() {
    return {
      loading: false,
      searchText: "",

      tableData: [],

      userList: [],
      userpageSize: 10,
      usercurrent: 1,
      usertotal: 0,
      usercurrentRow: "",
      usersearchText: "",

      selectVal: "name",

      pageSize: 10,
      current: 1,
      total: 0,
      spanArr: [],
      pos: "",

      form: {},
      dialogVisible: false,

      dialogOwnerVisible: false,
      ownerForm: "",
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    saveOwner() {
      const apQuery = this.$Bmob.Query("activity_person");
      apQuery.get(this.ownerForm.objectId).then((ap) => {
        if (this.usercurrentRow && this.usercurrentRow.objectId) {
          const pointer = this.$Bmob.Pointer("_User");
          const poiID = pointer.set(this.usercurrentRow.objectId);
          ap.set("owner", poiID);
        } else {
          ap.unset("owner");
        }
        ap.save().then(() => {
          this.ownerForm = {};
          this.dialogOwnerVisible = false;
          this.getlist();
        });
      });
    },
    setOwner(item) {
      this.ownerForm = item;
      this.dialogOwnerVisible = true;
      this.getUserList();
    },
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断这一条和上一条id是否相同
          if (
            data[i].order.payReslut.out_trade_no ===
              data[i - 1].order.payReslut.out_trade_no &&
            data[i].user.nickname === data[i - 1].user.nickname
          ) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 7 ||
        columnIndex === 8 ||
        columnIndex === 9
      ) {
        console.log(row, column, rowIndex, columnIndex);
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },

    getlistCount() {
      if (this.$route.query.id) {
        const pointer = this.$Bmob.Pointer("activity");
        const poiID = pointer.set(this.$route.query.id);

        const query = this.$Bmob.Query("activity_person");

        query.order("-createdAt");
        query.equalTo("activity", "==", poiID);

        if (this.searchText) {
          query.statTo(
            "where",
            '{"activity":{"$inQuery":{"where":{"objectId":"' + this.$route.query.id + '"},"className":"activity"}}, "order":{"$inQuery":{"where":{"' +
              this.selectVal +
              '":"' +
              this.searchText +
              '"},"className":"order_list"}}}'
          );
        }

        query.count().then((count) => {
          this.total = count;
        });
      }
    },
    getlist() {
      this.loading = true;
      if (this.$route.query.id) {
        const pointer = this.$Bmob.Pointer("activity");
        const poiID = pointer.set(this.$route.query.id);

        const query = this.$Bmob.Query("activity_person");
        const skip = this.pageSize * (this.current - 1);
        query.limit(this.pageSize);
        query.skip(skip);
        query.order("-createdAt");
        query.equalTo("activity", "==", poiID);
        if (this.searchText) {
          query.statTo(
            "where",
            '{"activity":{"$inQuery":{"where":{"objectId":"' + this.$route.query.id + '"},"className":"activity"}}, "order":{"$inQuery":{"where":{"' +
              this.selectVal +
              '":"' +
              this.searchText +
              '"},"className":"order_list"}}}'
          );
        }
        query.include("order", "user", "activity", "owner");

        //userId 字段名称关联用户表 ，类型Pointer
        query.find().then((res) => {
          this.loading = false;
          this.tableData = res;
          this.getlistCount();

          this.getSpanArr(res);
        });
      }
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

    getUserList() {
      const userCountQuery = this.$Bmob.Query("_User");
      if (this.usersearchText !== "") {
        const query1 = userCountQuery.equalTo("nickname", "==", {
          $regex: "" + this.usersearchText + ".*",
        });
        const query2 = userCountQuery.equalTo("username", "==", {
          $regex: "" + this.usersearchText + ".*",
        });
        userCountQuery.or(query1, query2);
      }
      userCountQuery.count().then((count) => {
        this.usertotal = count;
      });

      this.userList = [];
      var userQuery = this.$Bmob.Query("_User");
      if (this.usersearchText !== "") {
        const query1 = userQuery.equalTo("nickname", "==", {
          $regex: "" + this.usersearchText + ".*",
        });
        const query2 = userQuery.equalTo("username", "==", {
          $regex: "" + this.usersearchText + ".*",
        });
        userQuery.or(query1, query2);
      }
      userQuery.order("-updatedAt");
      const skip = this.userpageSize * (this.usercurrent - 1);
      userQuery.limit(this.userpageSize);
      userQuery.skip(skip);
      userQuery.find().then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          this.userList.push(res[i]);
        }
      });
    },

    handleUserSizeChange(page) {
      this.usercurrent = 1;
      this.userpageSize = page;
      this.getUserList();
    },
    handleUserCurrentChange(current) {
      this.usercurrent = current;
      this.getUserList();
    },
    handleUserRowChange(val) {
      this.usercurrentRow = val;
    },

    cancel(id) {
      this.$confirm("此操作将取消该用户对本次活动的报名, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const query = this.$Bmob.Query("activity_person");
          query.set("id", id); //需要修改的objectId
          query.set("isApply", false);
          query.save().then((res) => {
            console.log(res);
            this.getlist();
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // });
        });
    },
    replace(id) {
      this.$confirm("此操作将为该用户重新报名本次活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const query = this.$Bmob.Query("activity_person");
          query.set("id", id); //需要修改的objectId
          query.set("isApply", true);
          query.save().then((res) => {
            console.log(res);
            this.getlist();
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // });
        });
    },
    comfilmChecked(id) {
      this.$confirm("确认验票作废吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const query = this.$Bmob.Query("activity_person");
        query
          .get(id)
          .then((res) => {
            console.log(res);
            res.set("isChecked", true);
            res.save().then(() => {
              this.getlist();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    cancelChecked(id) {
      this.$confirm("确认取消作废吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const query = this.$Bmob.Query("activity_person");
        query
          .get(id)
          .then((res) => {
            console.log(res);
            res.set("isChecked", false);
            res.save().then(() => {
              this.getlist();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    comfilmWechat(id) {
      this.$confirm("确认加微信了吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const query = this.$Bmob.Query("activity_person");
        query
          .get(id)
          .then((res) => {
            console.log(res);
            res.set("isWechat", true);
            res.save().then(() => {
              this.getlist();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    cancelWechat(id) {
      this.$confirm("确认没有加微信吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const query = this.$Bmob.Query("activity_person");
        query
          .get(id)
          .then((res) => {
            console.log(res);
            res.set("isWechat", false);
            res.save().then(() => {
              this.getlist();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    comfilmPaid(id) {
      this.$confirm("确认该用户已支付吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const query = this.$Bmob.Query("activity_person");
          query.set("id", id); //需要修改的objectId
          query.set("isPaid", true);
          query.save().then((res) => {
            console.log(res);
            this.getlist();
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // });
        });
    },
    cancelPaid(id) {
      this.$confirm("确认该用户取消支付吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const query = this.$Bmob.Query("activity_person");
          query.set("id", id); //需要修改的objectId
          query.set("isPaid", false);
          query.save().then((res) => {
            console.log(res);
            this.getlist();
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // });
        });
    },

    formMessage(result) {
      const that = this;
      var message = {};
      if (typeof result === "object") {
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) {
          var item = result[keys[i]];
          var key = keys[i];
          if (!(item instanceof Array) || item.length === 0) {
            continue;
          }
          if (item.length === 1) {
            var val = item[0];
            if (typeof val === "object") {
              message[key] = this.formMessage(val);
            } else {
              message[key] = (val || "").trim();
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
      let result = "";
      for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    },
    checkWechatRefund(item) {
      const that = this;

      const appid = "wx34c87ef5d4d802d9";
      const mch_id = "1570704211";
      const nonce_str = this.randomString(
        32,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );

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
        funcName: "refundquery",
        data: {
          formData,
        },
      };
      this.$Bmob.functions(param.funcName, param.data).then((resultData) => {
        // xml转json格式
        xml2js.parseString(resultData, function (err, json) {
          if (err) {
            new Error("解析xml报错");
          } else {
            var result = that.formMessage(json.xml); // 转换成正常的json 数据
            console.log(result); //打印出返回的结果
            that.form = result;
          }
        });
      });
    },
    checkWechatOrder(item) {
      const that = this;
      this.dialogVisible = true;

      const appid = "wx34c87ef5d4d802d9";
      const mch_id = "1570704211";
      const nonce_str = this.randomString(
        32,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );

      const stringA = `appid=${appid}&mch_id=${mch_id}&nonce_str=${nonce_str}&out_trade_no=${item.order.payReslut.out_trade_no}`;
      const stringSignTemp = stringA + "&key=5f99609225b2944c2e230ade0fa99cc9"; //注：key为商户平台设置的密钥key
      const sign = md5(stringSignTemp).toUpperCase();

      const formData = `<xml>
      <appid>${appid}</appid>
      <mch_id>${mch_id}</mch_id>
      <nonce_str>${nonce_str}</nonce_str>
      <out_trade_no>${item.order.payReslut.out_trade_no}</out_trade_no>
      <sign>${sign}</sign>
      </xml>`;

      let param = {
        funcName: "orderquery",
        data: {
          formData,
        },
      };
      this.$Bmob.functions(param.funcName, param.data).then((resultData) => {
        // xml转json格式
        xml2js.parseString(resultData, function (err, json) {
          if (err) {
            new Error("解析xml报错");
          } else {
            var result = that.formMessage(json.xml); // 转换成正常的json 数据
            // console.log(JSON.stringify(result)) //打印出返回的结果
            if (result.trade_state === "SUCCESS") {
              that.form = result;
            }
            if (result.trade_state === "REFUND") {
              that.checkWechatRefund(item.order.payReslut);
            }
            const orderquery = that.$Bmob.Query("order_list");
            orderquery.set("id", item.order.objectId);
            orderquery.set("payReslut", result);
            orderquery.save().then(() => {
              that.getlist();
            });
            // console.log(item.order.objectId);
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scope>
.applicants {
  .page-top {
    position: relative;
    padding: 15px;
    height: 40px;
    background-color: #fff;
    margin-bottom: 15px;
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
      display: flex;
    }
  }
  .layer-table {
    padding: 15px;
    width: 100%;
    height: calc(100% - 231px);
    background-color: #fff;
    overflow: auto;
    box-sizing: border-box;
    .el-table::before {
      background-color: #fff;
    }
    .title {
      font-size: 12px;
    }
  }
}
.el-button--primary.is-disabled {
  background-color: #ebebeb;
  color: #333;
  border-color: #ebebeb;
}
.pagination {
  padding: 0 50px;
  width: 100%;
  height: 50px;
  text-align: right;
  background-color: #fff;
  box-sizing: border-box;
}
</style>
