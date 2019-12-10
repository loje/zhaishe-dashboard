<template>
  <div class="member-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>会员列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">新建会员</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="用户名"
          prop="username">
        </el-table-column>
        <el-table-column
          label="名字"
          prop="name">
        </el-table-column>
        <el-table-column
          label="微信"
          prop="wechatId">
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="mobilePhoneNumber">
        </el-table-column>
        <el-table-column
          label="邮箱"
          prop="email">
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="添加会员"
      :visible.sync="dialogVisible"
      width="30%"
      v-loading="dialog.loading"
      center>
      <el-form label-width="70px" :model="dialog.form" :rules="dialog.rules" ref="dialogForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="dialog.form.username"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input type="text" v-model="dialog.form.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobilePhoneNumber">
          <el-input type="text" v-model="dialog.form.mobilePhoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="dialog.form.email"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wechatId">
          <el-input type="text" v-model="dialog.form.wechatId"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="dialog.form.password" :disabled="true" placeholder="默认为123456"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      dialogVisible: false,
      dialog: {
        loading: false,
        selectUser: '',
        form: {
          password: '',
        },
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          // name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
          // mobilePhoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
          // email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
          // wechatId: [{ required: true, message: '请输入微信号', trigger: 'blur' }],
        },
      },
    }
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;
      const that = this;
      var userListQuery = this.$Bmob.Query('_User');
      userListQuery.find().then((res) => {
        that.loading = false;
        that.tableData = [];
        for (let i = 0; i < res.length; i += 1) {
          that.tableData.push(res[i].attributes);
        }
      });
    },
    submitForm() {
      const that = this;
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.dialog.loading = true;
          var newMember = this.$Bmob.Object('_User');
          newMember.set(that.dialog.form);
          newMember.set('password', '123456'); // 暂时为123456
          newMember.set('isAdmin', false);

          newMember.save().then(() => {
            this.dialog.loading = false;
            that.dialogVisible = false;
            that.getlist();
            that.$message.success('新增成功！');
          }).catch(() => {
            this.dialog.loading = false;
            // that.dialogVisible = false;
            // that.getlist();
            // that.$message.error(err.error);
          });
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
    height: calc(100% - 133px);
    background-color:#fff;
    overflow: auto;
    box-sizing: border-box;
    .table-func {
      text-align: right;
    }
    .el-table::before {
      background-color: #fff;
    }
    .title {
      font-size: 12px;
    }
  }
</style>