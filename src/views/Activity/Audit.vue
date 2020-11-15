<template>
  <div class="applicants">
    <div class="page-top">
      <div class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/activity' }"
            >活动列表</el-breadcrumb-item
          >
          <el-breadcrumb-item>查看已报名人</el-breadcrumb-item>
          <el-breadcrumb-item v-loading="loading"
            >{{ $route.query.title }}
            <el-tag type="info"
              >当前共{{ total }}人报名</el-tag
            ></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <el-divider></el-divider>
      <div class="top-func">
        <div class="the-func">
          <el-input
            placeholder="请输入内容"
            v-model="searchText"
            class="input-with-select"
            clearable
            size="small"
          >
            <el-select
              v-model="selectVal"
              placeholder="请选择"
              clearable
              slot="prepend"
              style="width: 100px"
            >
              <el-option-group label="订单筛选">
                <el-option label="订单号" value="objectId"></el-option>
                <!-- <el-option label="商户订单号" value="out_trade_no"></el-option> -->
                <!-- <el-option label="微信订单号" value="transaction_id"></el-option> -->
              </el-option-group>
              <el-option-group label="购买人筛选">
                <el-option label="名字" value="name"></el-option>
                <el-option label="电话" value="phone"></el-option>
                <el-option label="微信" value="wechatId"></el-option>
                <el-option label="邮箱" value="email"></el-option>
              </el-option-group>
            </el-select>
          </el-input>
        </div>
        <div class="the-func">
          <span>微信状态(旧)：</span>
          <el-select
            size="small"
            v-model="wechatOldStatus"
            placeholder="请选择"
            @change="wechatOldStatusChange"
            clearable
          >
            <el-option :value="true" label="取消加微信"></el-option>
            <el-option :value="false" label="确认加微信"></el-option>
          </el-select>
        </div>
        <div class="the-func">
          <span>微信状态：</span>
          <el-select
            size="small"
            v-model="wechatStatus"
            @change="wechatStatusChange"
            placeholder="请选择"
            clearable
          >
            <el-option value="not_yet" label="未加微信"></el-option>
            <el-option value="add" label="已发请求"></el-option>
            <el-option value="sent" label="已加微信"></el-option>
            <el-option value="not_found" label="搜索不到"></el-option>
          </el-select>
        </div>
        <div class="the-func">
          <span>报名时间：</span>
          <el-date-picker
            v-model="applicationDate"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          >
          </el-date-picker>
        </div>
        <div class="the-func">
          <span>支付状态：</span>
          <el-select
            v-model="payStatus"
            size="small"
            placeholder="请选择"
            clearable
          >
            <el-option value="SUCCESS" label="支付成功"></el-option>
            <el-option value="REFUND" label="转入退款"></el-option>
            <el-option value="PAYERROR" label="未支付"></el-option>
            <el-option value="CLOSED" label="已关闭"></el-option>
            <el-option value="REVOKED" label="已撤销（付款码支付）"></el-option>
            <el-option
              value="USERPAYING"
              label="用户支付中（付款码支付）"
            ></el-option>
            <el-option
              value="PAYERROR"
              label="支付失败(其他原因，如银行返回失败)"
            ></el-option>
          </el-select>
        </div>
        <div class="the-func">
          <el-button
            icon="el-icon-search"
            size="small"
            type="primary"
            @click="dataSearch"
            >搜索</el-button
          >
        </div>
        <div class="the-func">
          <el-button
            icon="el-icon-download"
            size="small"
            type="primary"
            @click="exportExcel"
						:loading="exporting"
            >{{exportBtn}}</el-button
          >
        </div>
      </div>
      <el-divider></el-divider>
      <div id="container" style="height: 100px" v-loading="canvasLoading"></div>
    </div>
    <div class="layer-table">
      <el-table
        id="table"
        :data="tableData"
        style="width: 100%; border-bottom: 1px solid #ebeef5"
        v-loading="loading"
        :span-method="objectSpanMethod"
        border
      >
        <el-table-column label="序号" prop="index" width="50" align="center">
          <template slot-scope="scope">{{
            scope.$index + 1 + (current - 1) * pageSize
          }}</template>
        </el-table-column>
        <el-table-column label="订单号" prop="index" width="220">
          <template slot-scope="scope">
            <div>{{ scope.row.order.objectId }}</div>

            <el-link
              icon="el-icon-edit"
              :underline="false"
              @click="editRemark(scope.row.order.objectId)"
              style="
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              <span v-if="scope.row.order.remark" style="color: #606266">{{
                scope.row.order.remark
              }}</span>
              <span style="color: #999" v-else>添加备注</span>
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="商户订单号（微信支付订单号）" width="220">
          <template slot-scope="scope">
            {{ scope.row.order && scope.row.order.payReslut && scope.row.order.payReslut.out_trade_no ? scope.row.order.payReslut.out_trade_no : '' }}
            <br />
            （{{ scope.row.order && scope.row.order.payReslut && scope.row.order.payReslut.transaction_id ? scope.row.order.payReslut.transaction_id : '' }}）
          </template>
        </el-table-column>

        <el-table-column label="购买用户" align="left" width="150">
          <template slot-scope="scope">
            <div style="white-space: nowrap">
              <div
                :style="{
                  display: 'inline-block',
                  backgroundImage: `url(${scope.row.user.imgSrc})`,
                  width: '18px',
                  height: '18px',
                  backgroundSize: 'cover',
                  verticalAlign: 'middle',
                  borderRadius: '50%',
                }"
                v-if="!scope.row.nickname && scope.row.user"
              ></div>
              <span style="display: inline-block; margin-left: 5px">{{
                scope.row.user.nickname || scope.row.user.username
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="受赠用户" align="left">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.owner &&
                (scope.row.owner.nickname || scope.row.owner.username)
              "
              >{{ scope.row.owner.nickname || scope.row.owner.username }}</span
            >
            <el-button type="text" @click="setOwner(scope.row)" size="mini"
              >受赠用户</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="名字" prop="name" align="center">
          <template slot-scope="scope">{{ scope.row.order.name }}</template>
        </el-table-column>
        <el-table-column
          label="电话"
          prop="mobilePhoneNumber"
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">{{ scope.row.order.phone }}</template>
        </el-table-column>
        <el-table-column label="微信" prop="wechatId" align="center">
          <template slot-scope="scope">{{
            scope.row.wechat && scope.row.wechat.wechatId
              ? scope.row.wechat.wechatId
              : scope.row.order && scope.row.order.wechatId
              ? scope.row.order.wechatId
              : scope.row.user && scope.row.user.wechatId
              ? scope.row.user.wechatId
              : ""
          }}</template>
        </el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">{{
            scope.row.order.email || scope.row.user.email
          }}</template>
        </el-table-column>
        <el-table-column
          label="报名时间"
          prop="createTime"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">{{
            scope.row.order.createdAt
          }}</template>
        </el-table-column>

        <el-table-column
          label="支付金额"
          prop="total_fee"
          align="right"
          min-width="100"
        >
          <template slot-scope="scope">
            <template
              v-if="
                scope.row.order.payReslut && scope.row.order.payReslut.total_fee
              "
            >
              {{ (scope.row.order.payReslut.total_fee / 100).toFixed(2) || "" }}
            </template>
            <template v-else>无金额订单</template>
            <div style="color: #999; font-size: 12px">
              <span v-if="scope.row.order.attrName"
                >{{ scope.row.order.attrName }} x</span
              >
              {{ scope.row.order.buyerCount }}张
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="支付状态"
          prop="trade_state_desc"
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.order && scope.row.order.payReslut && scope.row.order.payReslut.trade_state_desc ? scope.row.order.payReslut.trade_state_desc : "" }}
            <el-button
              size="small"
              @click="checkWechatOrder(scope.row)"
              style="color: #00c250; border-color: #00c250"
              v-if="scope.row.order && scope.row.order.payReslut && scope.row.order.payReslut.trade_state_desc"
              >微信对账</el-button
            >
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="330">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="comfilmChecked(scope.row.objectId)"
              v-if="scope.row.isChecked === false || !scope.row.isChecked"
              >验票作废</el-button
            >
            <el-button
              type="info"
              size="small"
              @click="cancelChecked(scope.row.objectId)"
              v-else
              >取消作废</el-button
            >
            <template v-if="scope.row.wechat && scope.row.wechat.objectId">
              <el-dropdown
                @command="handleCommand"
                style="margin: 0 10px; width: 94px"
              >
                <el-button
                  type="primary"
                  size="small"
                  v-if="scope.row.wechat.status === 'not_yet'"
                >
                  未加微信
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-button
                  type="default"
                  size="small"
                  v-else-if="scope.row.wechat.status === 'sent'"
                >
                  已发请求
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-button
                  type="info"
                  size="small"
                  v-else-if="scope.row.wechat.status === 'add'"
                >
                  已加微信
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  v-else-if="scope.row.wechat.status === 'not_found'"
                >
                  搜索不到
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{
                      value: 'not_yet',
                      id: scope.row.wechat.objectId,
                    }"
                    >未加微信</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ value: 'sent', id: scope.row.wechat.objectId }"
                    >已发请求</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ value: 'add', id: scope.row.wechat.objectId }"
                    >已加微信</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{
                      value: 'not_found',
                      id: scope.row.wechat.objectId,
                    }"
                    >搜索不到</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template v-else>
              <el-button
                type="primary"
                size="small"
                @click="comfilmWechat(scope.row.objectId)"
                v-if="scope.row.isWechat === false"
                >确认加微信</el-button
              >
              <el-button
                type="info"
                size="small"
                @click="cancelWechat(scope.row.objectId)"
                v-else
                >取消加微信</el-button
              >
            </template>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-close"
              @click="cancel(scope.row.objectId)"
              v-if="scope.row.isApply === true"
              >取消报名</el-button
            >
            <el-button
              type="info"
              size="small"
              icon="el-icon-check"
              @click="replace(scope.row.objectId)"
              v-else
              >再次报名</el-button
            >
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
          <el-form-item label="微信支付订单号：" label-width="100">{{
            form.transaction_id
          }}</el-form-item>
          <el-form-item label="商户订单号：" label-width="100">{{
            form.out_trade_no
          }}</el-form-item>
          <el-form-item label="支付完成时间：" label-width="100"
            >{{ form.time_end.substring(0, 4) }}-{{
              form.time_end.substring(4, 6)
            }}-{{ form.time_end.substring(6, 8) }}
            {{ form.time_end.substring(8, 10) }}:{{
              form.time_end.substring(10, 12)
            }}:{{ form.time_end.substring(12, 14) }}</el-form-item
          >
          <el-form-item label="交易状态描述：" label-width="100">{{
            form.trade_state_desc
          }}</el-form-item>
          <el-form-item label="订单金额：" label-width="100">{{
            (form.total_fee / 100).toFixed(2)
          }}</el-form-item>
        </el-form>
      </template>
      <template v-if="!form.trade_state && form.return_code === 'SUCCESS'">
        <el-form :model="form">
          <el-form-item label="退款笔数：" label-width="100">{{
            form.refund_count
          }}</el-form-item>
          <el-form-item label="微信支付订单号：" label-width="100">{{
            form.transaction_id
          }}</el-form-item>
          <el-form-item label="商户订单号：" label-width="100">{{
            form.out_trade_no
          }}</el-form-item>
          <el-form-item label="订单金额：" label-width="100">{{
            form.total_fee / 100
          }}</el-form-item>
        </el-form>
      </template>
    </el-dialog>

    <el-dialog
      title="设置受赠用户"
      :visible.sync="dialogOwnerVisible"
      width="600px"
    >
      <el-card shadow="hover" style="margin-bottom: 10px">
        <div slot="header" class="clearfix">
          <span>当前选择</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="usercurrentRow = ''"
            >清空选择</el-button
          >
        </div>
        <template v-if="usercurrentRow">
          {{ usercurrentRow.objectId }} -
          <span style="white-space: nowrap">
            <div
              :style="{
                display: 'inline-block',
                backgroundImage: `url(${usercurrentRow.imgSrc})`,
                width: '18px',
                height: '18px',
                backgroundSize: 'cover',
                verticalAlign: 'middle',
                borderRadius: '50%',
              }"
            ></div>
            <span style="display: inline-block; margin-left: 5px">{{
              usercurrentRow.nickname || usercurrentRow.username
            }}</span>
          </span>
        </template>
        <template v-else>
          <span style="color: #999; font-size: 12px"
            >请选择受赠用户，不选择默认取消受赠用户</span
          >
        </template>
      </el-card>
      <el-divider>✂</el-divider>
      <el-input
        placeholder="请输入微信昵称/用户名"
        v-model="usersearchText"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getUserList"
        ></el-button>
      </el-input>
      <el-table
        :data="userList"
        highlight-current-row
        @current-change="handleUserRowChange"
      >
        <el-table-column label="序号" prop="index" width="60">
          <template slot-scope="scope">{{
            scope.$index + 1 + (usercurrent - 1) * userpageSize
          }}</template>
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
              <div style="white-space: nowrap">
                <div
                  :style="{
                    display: 'inline-block',
                    backgroundImage: `url(${scope.row.imgSrc})`,
                    width: '18px',
                    height: '18px',
                    backgroundSize: 'cover',
                    verticalAlign: 'middle',
                    borderRadius: '50%',
                  }"
                ></div>
                <span style="display: inline-block; margin-left: 5px">{{
                  scope.row.nickname || scope.row.username
                }}</span>
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

    <el-dialog title="编辑备注" :visible.sync="dialogRemarkVisible">
      <el-input type="textarea" v-model="dialogRemark.text" rows="3"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRemarkClose">取 消</el-button>
        <el-button type="primary" @click="dialogRemarkComfilm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from "js-md5";
import xml2js from "xml2js";
import { Area } from "@antv/g2plot";
// import FileSaver from "file-saver";
// import XLSX from "xlsx";
import { export_json_to_excel } from "../../static/Export2Excel";

export default {
  data() {
    return {
      loading: false,
      searchText: "",

      pickerOptions: "",

      tableData: [],

      userList: [],
      userpageSize: 10,
      usercurrent: 1,
      usertotal: 0,
      usercurrentRow: "",
      usersearchText: "",

      selectVal: "objectId",
      wechatStatus: "",
      wechatOldStatus: "",
      applicationDate: [],
      payStatus: "",

      pageSize: 10,
      current: 1,
      total: 0,
      spanArr: [],
      pos: "",

      form: {},
      dialogVisible: false,

      dialogOwnerVisible: false,
      ownerForm: "",

      dialogRemark: {
        text: "",
        orderId: "",
      },
      dialogRemarkVisible: false,

      canvasData: [],
      canvasDate: [],
      canvasLoading: false,

			exportData: [],
			exportSize: 20,
			exportCurrent: 1,
			exporting: false,
			exportBtn: '导出全部',
    };
  },
  mounted() {
    this.getActivityData();
  },
  methods: {
    formatJson(filterVal, tableData) {
      return tableData.map((v) => {
        return filterVal.map((j) => {
          return v[j];
        });
      });
		},
		
		async pagingData() {
			const pointer = this.$Bmob.Pointer("activity");
      const poiID = pointer.set(this.$route.query.id);

			const query = this.$Bmob.Query("activity_person");
			const skip = this.exportSize * (this.exportCurrent - 1);
			query.limit(this.exportSize);
			query.skip(skip);
      query.order("-createdAt");
      query.equalTo("activity", "==", poiID);
      query.include("order", "user", "activity", "owner");
			let list = await query.find();
			
      for (let a = 0; a < list.length; a += 1) {
        if (list[a].order.userWechat) {
          let wechatQuery = this.$Bmob.Query("user_wechat");
          let wechat = await wechatQuery.get(list[a].order.userWechat.objectId);
          list[a].wechat = wechat;
        }
			}
			return list;
		},
    async getExportData() {
			this.exporting = true;
			this.exportBtn = '导出中';
			let arr = [];
			do {
				let list = await this.pagingData();
				list.map((item) => {
					arr.push({
						num: arr.length + 1,
						orderId: item.order.objectId,
						nickname: item.user.nickname,
						userId: item.user.objectId,
						name: item.order.name,
						phone: item.order.phone,
						wechatId:
							item.wechat && item.wechat.wechatId
								? item.wechat.wechatId
								: item.order && item.order.wechatId
								? item.order.wechatId
								: item.user && item.user.wechatId
								? item.user.wechatId
								: "",
						email: item.order.email,
						createdAt: item.order.createdAt,
						totalFee:
							item.order.payReslut && item.order.payReslut.total_fee
								? (item.order.payReslut.total_fee / 100).toFixed(2)
								: "无金额订单",
						payStatus: item.order.trade_state,
						isChecked: item.isChecked === true ? "是" : "否",
					});
				});
				this.exportCurrent = this.exportCurrent + 1;
			}
			while (arr.length % this.exportSize === 0)
			
			return arr;
    },
    async exportExcel() {
      let list = await this.getExportData();
      var tHeader = [
        "序号",
        "订单号",
        "购买用户名",
        "用户ID",
        "名字",
        "电话",
        "微信号",
        "邮箱",
        "报名时间",
        "支付金额",
        "支付状态",
        "验票作废（是/否）",
      ];
      var filterVal = [
        "num",
        "orderId",
        "nickname",
        "userId",
        "name",
        "phone",
        "wechatId",
        "email",
        "createdAt",
        "totalFee",
        "payStatus",
        "isChecked",
      ];
      var filename = this.$route.query.title + '的报名列表';
			var data = this.formatJson(filterVal, list);
			this.exporting = false;
			this.exportBtn = '导出全部';
      export_json_to_excel({
        header: tHeader,
        data,
        filename,
      });
    },
    dialogRemarkClose() {
      this.dialogRemark = {
        text: "",
        orderId: "",
      };
      this.dialogRemarkVisible = false;
    },
    dialogRemarkComfilm() {
      let remarkQuery = this.$Bmob.Query("order_list");
      remarkQuery.get(this.dialogRemark.orderId).then((remark) => {
        if (this.dialogRemark.text.length > 0) {
          remark.set("remark", this.dialogRemark.text);
        } else {
          remark.unset("remark");
        }
        remark.save().then(() => {
          this.dialogRemarkVisible = false;
          this.dialogRemark = {
            text: "",
            orderId: "",
          };
          this.getlist();
        });
      });
    },

    dataSearch() {
      this.current = 1;
      this.skip = 0;
      this.getlist();
      this.getCanvasData();
    },
    editRemark(id) {
      this.dialogRemarkVisible = true;
      let remarkQuery = this.$Bmob.Query("order_list");
      remarkQuery.get(id).then((res) => {
        this.dialogRemark = {
          text: res.remark,
          orderId: id,
        };
      });
    },
    handleCommand(command) {
      let wechatQuery = this.$Bmob.Query("user_wechat");
      wechatQuery.get(command.id).then((wechatObj) => {
        wechatObj.set("status", command.value);
        wechatObj.save().then(() => {
          this.getlist();
        });
      });
    },
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
            data[i].order.payReslut &&
            data[i - 1].order.payReslut &&
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
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 9 ||
        columnIndex === 10
      ) {
        // console.warn(row, column, rowIndex, columnIndex);
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      // console.log({ rowIndex, columnIndex })
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
            '{"activity":{"$inQuery":{"where":{"objectId":"' +
              this.$route.query.id +
              '"},"className":"activity"}}, "order":{"$inQuery":{"where":{"' +
              this.selectVal +
              '":"' +
              this.searchText +
              '"},"className":"order_list"}}}'
          );
        }

        if (this.wechatStatus !== "") {
          query.statTo(
            "where",
            '{"activity":{"$inQuery":{"where":{"objectId":"' +
              this.$route.query.id +
              '"},"className":"activity"}}, "userWechat":{"$inQuery":{"where":{"status":"' +
              this.wechatStatus +
              '"},"className":"user_wechat"}}}'
          );
        }

        query.count().then((count) => {
          this.total = count;
        });
      }
    },
    wechatOldStatusChange(e) {
      if (e !== '') {
        this.wechatStatus = '';
      }
    },
    wechatStatusChange(e) {
      if (e !== '') {
        this.wechatOldStatus = '';
      }
    },
    async getlist() {
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

        let activitykey = `"activity":{
          "$inQuery":{
            "where":{
              "objectId":"${this.$route.query.id}"
            },
            "className":"activity"
          }
        }`;
        let transactionkey = this.selectVal !== "out_trade_no" &&
            this.selectVal !== "transaction_id" && this.searchText ? `,"order":{
          "$inQuery":{
            "where":{
              "${this.selectVal}":"${this.searchText}"
            },
            "className":"order_list"
          }
        }` : '';

        let wechatStatusKey = this.wechatStatus !== "" ? `,"userWechat":{
          "$inQuery":{
            "where":{
              "status":"${this.wechatStatus}"
            },
            "className":"user_wechat"
          }
        }` : '';

        let wechatOldStatusKey = this.wechatOldStatus !== '' ? `,"isWechat": ${this.wechatOldStatus}` : '';

        let payStatusKey = this.payStatus ? `,"order":{
          "$inQuery":{
            "where":{
              "trade_state":"${this.payStatus}"
            },
            "className":"order_list"
          }
        }` : '';

        if (transactionkey !== '' || wechatStatusKey !== '' || wechatOldStatusKey !== '' || payStatusKey !== '') {
          query.statTo("where", `{${activitykey}${transactionkey}${wechatStatusKey}${wechatOldStatusKey}${payStatusKey}}`);
        }

        query.include("order", "user", "activity", "owner");

        //userId 字段名称关联用户表 ，类型Pointer
        let res = await query.find();
        this.loading = false;
        for (let a = 0; a < res.length; a += 1) {
          if (res[a].order.userWechat) {
            let wechatQuery = this.$Bmob.Query("user_wechat");
            let wechat = await wechatQuery.get(
              res[a].order.userWechat.objectId
            );
            res[a].wechat = wechat;
          }
        }
        this.tableData = res;
        this.getlistCount();

        this.getSpanArr(res);
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
          query.save().then(() => {
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
          query.save().then(() => {
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
            res.set("isChecked", true);
            res.save().then(() => {
              this.getlist();
            });
          })
          .catch((err) => {
            console.error(err);
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
            res.set("isChecked", false);
            res.save().then(() => {
              this.getlist();
            });
          })
          .catch((err) => {
            console.error(err);
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
            res.set("isWechat", true);
            res.save().then(() => {
              this.getlist();
            });
          })
          .catch((err) => {
            console.error(err);
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
            res.set("isWechat", false);
            res.save().then(() => {
              this.getlist();
            });
          })
          .catch((err) => {
            console.error(err);
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
          query.save().then(() => {
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
          query.save().then(() => {
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
        // console.log(resultData);
        // xml转json格式
        xml2js.parseString(resultData, function (err, json) {
          if (err) {
            new Error("解析xml报错");
          } else {
            var result = that.formMessage(json.xml); // 转换成正常的json 数据
            that.form = result;
          }
        });
      });
    },
    checkWechatOrder(item) {
      const that = this;
      this.dialogVisible = true;

      const appid = "wx6437f6f13c54a09e";
      const mch_id = "1570704211"; /*  */
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
            console.log(result.trade_state);
            if (result.trade_state === "SUCCESS") {
              that.form = result;
            }
            if (result.trade_state === "REFUND") {
              that.checkWechatRefund(item.order.payReslut);
            }
            const orderquery = that.$Bmob.Query("order_list");
            orderquery.set("id", item.order.objectId);
            orderquery.set("payReslut", result);
            orderquery.set("trade_state", item.order.payReslut.trade_state);
            orderquery.save().then(() => {
              that.getlist();
            });
          }
        });
      });
    },

    getActivityData() {
      const activityData = this.$Bmob.Query("activity");
      activityData.get(this.$route.query.id).then((res) => {
        this.pickerOptions = {
          disabledDate(time) {
            return (
              time.getTime() < new Date(res.startTime.iso).getTime() ||
              time.getTime() > new Date().getTime()
            );
          },
        };

        this.canvasDate = [res.startTime.iso, res.endTime.iso];
        this.getlist();
        this.getCanvasData();
      });
    },
    async getCanvasData() {
      if (this.$route.query.id) {
        this.canvasLoading = true;
        const startTime = this.$moment(this.canvasDate[0]);
        const nowTime = this.$moment();

        let diffNow = 0;
        if (this.applicationDate.length === 0) {
          diffNow = nowTime.diff(startTime, "days");
        } else {
          diffNow =
            this.$moment(this.applicationDate[1]).diff(
              this.$moment(this.applicationDate[0]),
              "days"
            ) + 1;
        }

        const dayList = [];

        if (this.applicationDate.length === 0) {
          if (diffNow > 7) {
            for (let i = 0; i < 7; i += 1) {
              const pointer = this.$Bmob.Pointer("activity");
              const poiID = pointer.set(this.$route.query.id);
              const query = this.$Bmob.Query("activity_person");
              query.equalTo("activity", "==", poiID);
              query.equalTo(
                "createdAt",
                ">=",
                new Date(
                  `${this.$moment()
                    .subtract(i, "days")
                    .format("YYYY-MM-DD")} 00:00:00`
                )
              );
              query.equalTo(
                "createdAt",
                "<",
                new Date(
                  `${this.$moment()
                    .subtract(i, "days")
                    .format("YYYY-MM-DD")} 23:59:59`
                )
              );
              let data = await query.count();
              dayList.push({
                date: this.$moment().subtract(i, "days").format("YYYY-MM-DD"),
                value: data,
              });
            }
          } else {
            for (let i = 0; i < diffNow; i += 1) {
              const pointer = this.$Bmob.Pointer("activity");
              const poiID = pointer.set(this.$route.query.id);
              const query = this.$Bmob.Query("activity_person");
              query.equalTo("activity", "==", poiID);
              query.equalTo(
                "createdAt",
                ">=",
                new Date(
                  `${this.$moment()
                    .subtract(i, "days")
                    .format("YYYY-MM-DD")} 00:00:00`
                )
              );
              query.equalTo(
                "createdAt",
                "<",
                new Date(
                  `${this.$moment()
                    .subtract(i, "days")
                    .format("YYYY-MM-DD")} 23:59:59`
                )
              );
              let data = await query.count();
              dayList.push({
                date: this.$moment().subtract(i, "days").format("YYYY-MM-DD"),
                value: data,
              });
            }
          }
        } else {
          for (let i = 0; i < diffNow; i += 1) {
            const pointer = this.$Bmob.Pointer("activity");
            const poiID = pointer.set(this.$route.query.id);
            const query = this.$Bmob.Query("activity_person");
            query.equalTo("activity", "==", poiID);
            query.equalTo(
              "createdAt",
              ">=",
              new Date(
                `${this.$moment(this.applicationDate[1])
                  .subtract(i, "days")
                  .format("YYYY-MM-DD")} 00:00:00`
              )
            );
            query.equalTo(
              "createdAt",
              "<",
              new Date(
                `${this.$moment(this.applicationDate[1])
                  .subtract(i, "days")
                  .format("YYYY-MM-DD")} 23:59:59`
              )
            );
            let data = await query.count();
            dayList.push({
              date: this.$moment(this.applicationDate[1])
                .subtract(i, "days")
                .format("YYYY-MM-DD"),
              value: data,
            });
          }
        }
        this.canvasData = dayList.reverse();
        this.getCanvas();
      }
    },
    getCanvas() {
      const that = this;
      document.getElementById("container").innerHTML = "";
      const linePlot = new Area("container", {
        data: that.canvasData,
        xField: "date",
        yField: "value",
      });

      linePlot.render();
      this.canvasLoading = false;
    },
  },
};
</script>

<style lang="scss" scope>
.applicants {
  .page-top {
    position: relative;
    padding: 15px;
    min-height: 40px;
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
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .the-func {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 0 5px;
        box-sizing: border-box;
        color: #999;
        font-size: 13px;
      }
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
