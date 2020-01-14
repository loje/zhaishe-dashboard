<template>
  <div class="member-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>会员列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-tooltip class="item" effect="dark" content="暂不可用" placement="top">
          <el-button type="primary" icon="el-icon-plus" @click="create" >新建会员</el-button>
        </el-tooltip>
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
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="warning" @click="edit(scope.row.objectId)" icon="el-icon-edit" size="small">编辑</el-button>

            <el-button type="warning" @click="setAdmin(scope.row.objectId, true)" icon="el-icon-edit" size="small" v-if="scope.row.isAdmin === false">设为管理员</el-button>
            <el-button type="info" @click="setAdmin(scope.row.objectId, false)" icon="el-icon-edit" size="small" v-else>取消管理员</el-button>

            <el-button type="danger" @click="disable(scope.row.objectId, false)" icon="el-icon-edit" size="small" v-if="scope.row.isCustomer === true">禁用</el-button>
            <el-button type="info" @click="disable(scope.row.objectId, true)" icon="el-icon-edit" size="small" v-else>启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="dialogTitle"
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
          <el-input type="text" v-model="dialog.form.password" :disabled="dialogTitle === '新建会员'" :placeholder="dialogTitle === '新建会员' ? '默认为123456' : '请输入新密码'"></el-input>
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
      dialogTitle: '',
      dialog: {
        loading: false,
        selectUser: '',
        form: {
          password: '',
        },
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          // name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
          mobilePhoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
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
    create() {
      // this.dialogVisible = true;
      // this.dialogTitle = '新建会员';
    },
    edit(id) {
      this.dialogVisible = true;
      this.dialogTitle = '编辑会员';
      this.$Bmob.User.get(id).then(res => {
        this.dialog.form = res;
      });
    },
    getlist() {
      this.loading = true;
      const that = this;
      var userListQuery = this.$Bmob.Query('_User');
      userListQuery.find().then((res) => {
        that.loading = false;
        that.tableData = [];
        for (let i = 0; i < res.length; i += 1) {
          that.tableData.push(res[i]);
        }
      });
    },
    submitForm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.dialog.loading = true;
          let params = {
            email: this.dialog.form.email,
            isAdmin: this.dialog.form.isAdmin,
            mobilePhoneNumber: this.dialog.form.mobilePhoneNumber,
            name: this.dialog.form.name,
            username: this.dialog.form.username,
            wechatId: this.dialog.form.wechatId,
            password: '123456',
          };

          if (!this.dialog.form.objectId) {
            this.$Bmob.User.register(params).then(() => {
              this.dialog.loading = false;
              this.dialogVisible = false;
              this.getlist();
              this.$message.success('新增成功！');
            }).catch((err) => {
              this.dialog.loading = false;
              this.$message.error(err.error);
            });
          } else {
            const query = this.$Bmob.Query('_User');
            query.get(this.dialog.form.objectId).then(user => {
              user.set('username', this.dialog.form.username);
              user.set('name', this.dialog.form.name);
              user.set('mobilePhoneNumber', this.dialog.form.mobilePhoneNumber);
              user.set('email', this.dialog.form.email);
              user.set('wechatId', this.dialog.form.wechatId);
              if (this.dialog.form.password) {
                user.set('password', this.dialog.form.password);
              }
              user.save().then(() => {
                this.dialog.loading = false;
                this.dialogVisible = false;
                this.getlist();
              });
            }).catch(err => {
              this.dialog.loading = false;
              console.log(err)
            });
          }
        }
      });
    },
    setAdmin(id, boolean) {
      const query = this.$Bmob.Query('_User');
      query.get(id).then(user => {
        user.set('isAdmin', boolean);
        user.save().then(() => {
          this.$message.success('设置成功！');
          this.getlist();
        });
      });
    },
    disable(id, boolean) {
      const query = this.$Bmob.Query('_User');
      query.get(id).then(user => {
        user.set('isCustomer', boolean);
        user.save().then(() => {
          this.$message.success('设置成功！');
          this.getlist();
        });
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