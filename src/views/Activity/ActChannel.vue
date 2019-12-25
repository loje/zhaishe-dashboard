<template>
  <div>
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
          <el-breadcrumb-item>渠道列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="edit('新建')">新建渠道</el-button>

        <!-- <div class="input-group">
          <el-input type="text" placeholder="请输入内容" v-model="searchText" clearable>
            <el-button slot="append" icon="el-icon-search" @click="dataSearch" class="el-button--primary"></el-button>
          </el-input>
        </div> -->
      </div>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="渠道名字"
          prop="title">
        </el-table-column>
        <el-table-column
          label="报名数量"
          prop="count">
        </el-table-column>
        <el-table-column
          label="优惠码"
          prop="coupon">
        </el-table-column>
        <el-table-column
          label="有效开始时间"
          prop="startTime">
        </el-table-column>
        <el-table-column
          label="有效结束时间"
          prop="endTime">
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :visible="dialogVisible" :title="dialogTitle" @close="dialogClose">
      <el-form :model="form" :rules="rules" ref="form" label-width="130px" style="width: 500px;">
        <el-form-item label="渠道名字" prop="title">
          <el-input type="text" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="最大报名数量" prop="maxNum">
          <el-input-number v-model="form.maxNum" :min="1" 
          placeholder="1" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="有效时间" prop="time">
          <el-date-picker type="datetimerange" v-model="form.time" range-separator="至" start-placeholder="有效开始时间" end-placeholder="有效结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="费用" prop="fee">
          <el-input-number v-model="form.fee" :min="0.00" :precision="2" 
          placeholder="0.00" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="渠道码" prop="couponCode">
          <el-tag>{{form.couponCode}}</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfilm">确定</el-button>
      </span>
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
      loading: false,

      dialogVisible: false,
      dialogTitle: '',
      form: {},
      rules: {
        title: [{required: true, message: '请输入渠道名字', trigger: 'blur' }],
        maxNum: [{required: true, message: '请输入最大报名数量', trigger: 'blur' }],
        time: [{required: true, message: '请选择有效时间', trigger: 'blur' }],
        fee: [{required: true, message: '请输入费用', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.getAct();
    this.getCode();
  },
  methods: {
    getAct() {
      let actQuery = this.$Bmob.Query('activity');
      actQuery.get(this.$route.query.id).then((res) => {
        this.title = res.title;
      });
    },
    getlist() {
      let query = this.$Bmob.query('activity_channel');
      query.equalTo('notDelete', '==', true);
      query.find().then(() => {});
    },
    edit(type, id) {
      this.dialogVisible = true;
      switch (type) {
        case '新建':
          this.dialogTitle = '新建渠道';
          this.getCode();
          break;
        case '编辑':
          console.log(id);
          this.dialogTitle = '编辑渠道';
          break;
        default:
          break;
      }
    },
    getCode() {
      let codeBase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let count = 0;
      let channel = this.$Bmob.Query('activity_channel');
      channel.find().then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          if (res[i].activity.objectId === this.$route.query.id) {
            count += 1;
          }
        }
      });
      const positionYear = new Date().getFullYear().toString().substring(2, 4);
      const positionMonth = new Date().getMonth() + 1;
      const positionDay = new Date().getDate();

      this.form.couponCode = `${codeBase[positionYear]}${codeBase[positionMonth]}${codeBase[positionDay]}${count}`
    },
    dataSearch() {},

    dialogClose() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    dialogConfilm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.dialogVisible = false;
          this.$refs.form.resetFields();
        }
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
</style>