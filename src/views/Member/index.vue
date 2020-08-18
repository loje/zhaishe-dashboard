<template>
  <div class="member-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>会员列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <!-- <div class="top-func">
        <el-tooltip class="item" effect="dark" content="暂不可用" placement="top">
          <el-button type="primary" icon="el-icon-plus" @click="create" >新建会员</el-button>
        </el-tooltip>
      </div> -->
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="序号" width="80">
          <template slot-scope="scope">
            {{(current - 1) * pageSize + (scope.$index + 1)}}
            <template v-if="scope.row.sex === 0">👽</template>
            <template v-else-if="scope.row.sex === 1">👦</template>
            <template v-else-if="scope.row.sex === 2">👧</template>
          </template>
        </el-table-column>
        <el-table-column
          label="用户名">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
            <el-image :src="scope.row.imgSrc" style="margin-right:5px;width: 24px;height:24px;"></el-image>
            <span style="line-height:24px;">{{scope.row.nickname || scope.row.username}}</span>
            </div>
          </template>
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
        <el-table-column
          label="最近登录时间"
          prop="loginTime"
          sortable>
        </el-table-column>
        <el-table-column
          label="注册时长"
          prop="longTime">
          <template slot-scope="scope">
            <template v-if="scope.row.longTime">
              约{{scope.row.longTime}}天
            </template>
            <template v-else-if="scope.row.longHours">
              约{{scope.row.longHours}}小时 <el-tag type="success" size="mini">新用户</el-tag>
            </template>
            <template v-else-if="scope.row.longMinute">
              约{{scope.row.longMinute}}分钟 <el-tag type="success" size="mini">新用户</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="注册时间"
          prop="createdAt"
          sortable>
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

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      v-loading="dialog.loading"
      :close-on-click-modal="false"
      center>
      <el-form label-width="70px" :model="dialog.form" :rules="dialog.rules" ref="dialogForm">
        <el-form-item label="用户名" prop="nickname">
          <el-input type="text" v-model="dialog.form.nickname"></el-input>
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

      pageSize: 10,
      skip: 0,
      tableData: [],
      current: 1,
      total: 0,

      dialogVisible: false,
      dialogTitle: '',
      dialog: {
        loading: false,
        selectUser: '',
        form: {
          password: '',
        },
        rules: {
          nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
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
    this.getCount();
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
      const skip = this.pageSize * (this.current - 1);
      userListQuery.order("-loginTime");
      userListQuery.limit(this.pageSize);
      userListQuery.skip(skip);
      userListQuery.find().then((res) => {
        that.loading = false;
        that.tableData = [];
        for (let i = 0; i < res.length; i += 1) {
          for (let key in res[i].loginTime) {
            if (key === 'iso') {
              res[i].loginTime = res[i].loginTime[key];
            }
          }
          const longTime = parseInt((new Date().getTime() - new Date(res[i].createdAt).getTime()) / 1000 / 60 / 60 / 24);
          const longHours = parseInt((new Date().getTime() - new Date(res[i].createdAt).getTime()) / 1000 / 60 / 60);
          const longMinute = parseInt((new Date().getTime() - new Date(res[i].createdAt).getTime()) / 1000 / 60);
          if (longTime > 0) {
            res[i].longTime = longTime
          } else if (longHours > 0) {
            res[i].longHours = longHours
          } else {
            res[i].longMinute = longMinute
          }

          that.tableData.push(res[i]);
        }
      });
    },
    getCount() {
      var query = this.$Bmob.Query('_User');
      query.count().then((count) => {
        this.total = count;
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
    submitForm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.dialog.loading = true;
          let params = {
            email: this.dialog.form.email,
            isAdmin: this.dialog.form.isAdmin,
            mobilePhoneNumber: this.dialog.form.mobilePhoneNumber,
            name: this.dialog.form.name,
            nickname: this.dialog.form.nickname,
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
              }).catch(error => {
                this.dialog.loading = false;
                console.log(error);
                if (error.code === 202) {
                  this.$message.error('用户名已经存在');
                }
                if (error.code === 209) {
                  this.$message.error('该手机号码已经存在');
                }
                if (error.code === 203) {
                  this.$message.error('邮箱已经存在');
                }
                return false;
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
  .pagination {
    padding: 0 50px;
    width: 100%;
    height: 50px;
    text-align: right;
    background-color:#fff;
    box-sizing: border-box;
  }
</style>