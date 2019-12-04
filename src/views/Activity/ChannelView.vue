<template>
  <div class="channel">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/activity/channel' }">渠道管理</el-breadcrumb-item>
          <el-breadcrumb-item v-loading="loading">{{$route.query.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" class="add-btn" icon="el-icon-plus" @click="showDialog">添加</el-button>
        <el-input class="search-input" v-model="searchText" placeholder="请输入内容"></el-input>
        <el-button type="text" class="search-btn">搜索</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="渠道名字" prop="name" align="center"></el-table-column>
        <el-table-column label="报名数量" prop="applyNum" align="center"></el-table-column>
        <el-table-column label="报名费用" prop="fee" align="center"></el-table-column>
        <el-table-column label="优惠码" prop="coupon" align="center"></el-table-column>
        <el-table-column label="有效时间" prop="time" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.startTime}}</div>
            <div>{{scope.row.endTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
            <el-button type="primary" @click="edit(scope.row.id)" size="small">修改</el-button>
            <el-button type="danger" @click="del(scope.row.id)" size="small">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="增加渠道" :visible.sync="dialogVisible" width="38%" center>
      <el-form :model="dialog.form" :rules="dialog.rules" label-position="right" label-width="80px" ref="dialogform" style="width:100%;" v-loading="dialog.loading">
        <el-form-item label="渠道名字" prop="name">
          <el-select v-model="dialog.form.selectUser" filterable @change="selectChange" style="width: 100%;">
            <el-option v-for="(item, $index) in userList" :key="$index" :label="item.name" :value="$index">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">微信号：{{ item.wechatId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名数量" prop="applyNum">
          <el-input-number v-model="dialog.form.applyNum" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="时间限制" prop="time">
          <el-date-picker v-model="dialog.form.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="费用" prop="fee">
          <el-input-number v-model="dialog.form.fee" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="提示:">提交后生成专属优惠码</el-form-item>
        <el-form-item label="优惠码" prop="coupon">
          <el-tag type="warning" effect="light" style="letter-spacing: 4px; font-size: 18px;">{{dialog.form.coupon}}</el-tag>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="submitForm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      searchText: '',
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,

      userList: [],
      loading: false,
      dialog: {
        loading: false,
        form: {},
        rules: {
          selectUser: [{required: true, message: '请选择渠道管理者', trigger: 'blur'}],
          applyNum: [{required: true, message: '请输入报名数量', trigger: 'blur'}],
          time: [{required: true, message: '请选择限制时间', trigger: 'blur'}],
          fee: [{required: true, message: '请输入费用', trigger: 'blur'}],
        },
      },
    }
  },
  mounted() {
    this.getlist();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getUserList() {
      this.dialog.loading = true;
      const that = this;
      that.userList = [];
      var userQuery = new this.$AV.Query('_User');
      userQuery.find().then((res) => {
        that.dialog.loading = false;
        for (let i = 0; i < res.length; i += 1) {
          that.userList.push({
            id: res[i].id,
            ...res[i].attributes,
          });
        }
      });
    },
    getlist() {
      const that = this;
      this.loading = true;
      const arr = [];
      var channelQuery = new this.$AV.Query('channel');
      channelQuery.equalTo('notDelete', true);
      channelQuery.find().then((d) => {
        that.loading = false;
        for (let i = 0; i < d.length; i += 1) {
          var userQuery = new this.$AV.Query('_User');
          userQuery.get(d[i].get('manager').id).then((res) => {
            arr.push({
              id: d[i].id,
              name: res.get('name') || '',
              applyNum: d[i].get('applyNum') || '',
              fee: d[i].get('fee') || '',
              coupon: d[i].get('coupon') || '',
              startTime: that.$moment(d[i].attributes.startTime).format('YYYY-MM-DD HH:mm'),
              endTime: that.$moment(d[i].attributes.endTime).format('YYYY-MM-DD HH:mm'),
            });
          });
        }
        that.tableData = arr;
      });
    },
    selectChange(i) {
      const a = this.userList[i].id.slice(this.userList[i].id.length - 4, this.userList[i].id.length);
      const b = this.$route.query.activityid.slice(this.$route.query.activityid.length - 2, this.$route.query.activityid.length);
      const ab = `${a}${b}`;
      this.dialog.form.coupon = ab.split('').reverse().join('').toUpperCase();
    },
    showDialog() {
      this.dialogVisible = true;
      this.getUserList();
    },
    edit() {},
    del(id) {
      const that = this;
      this.$confirm('此操作将永久删除该用户的渠道, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var channel = this.$AV.Object.createWithoutData('channel', id);
        channel.set('notDelete', false);
        channel.save().then(() => {
          that.$message.success('删除成功！');
          that.getlist();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },

    submitForm() {
      const that = this;
      this.$refs.dialogform.validate((valid) => {
        if (valid) {
          that.dialog.loading = true;
          var newChannel = new that.$AV.Object('channel');
          var activityObject = that.$AV.Object.createWithoutData('activity', that.$route.query.activityid);
          var userObject = that.$AV.Object.createWithoutData('_User', that.userList[that.dialog.form.selectUser].id);
          const formData = {
            ...that.dialog.form,
            startTime: that.dialog.form.time && that.dialog.form.time[0] ? that.dialog.form.time[0] : undefined,
            endTime: that.dialog.form.time && that.dialog.form.time[1] ? that.dialog.form.time[1] : undefined,
            time: undefined,
            selectUser: undefined,
            activity: activityObject,
            manager: userObject,
          };
          delete formData.time;
          delete formData.selectUser;

          newChannel.set(formData);
          newChannel.save().then(() => {
            that.$message.success('添加成功');
            that.dialogVisible = false;
            that.getlist();
          });
        }
      });
    },
  },
}
</script>

<style lang="scss" scope>
  .channel {
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
        .del-btn {
          width: 120px;
        }
        .search-input {
          margin-left: 30px;
          width: 170px;
        }
        .search-btn {
          padding: 0 20px;
        }
      }
    }
    .layer-table {
      padding: 15px;
      width: 100%;
      height: calc(100% - 231px);
      background-color:#fff;
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
</style>