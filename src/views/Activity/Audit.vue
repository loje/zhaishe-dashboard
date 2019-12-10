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
        <el-button type="primary" class="add-btn" icon="el-icon-plus" @click="showDialog">添加</el-button>
        <el-input class="search-input" v-model="searchText" placeholder="名字/电话/微信号" clearable></el-input>
        <el-button type="text" class="search-btn" @click="getlist">搜索</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="名字" prop="name" align="center"></el-table-column>
        <el-table-column label="电话" prop="mobilePhoneNumber" align="center"></el-table-column>
        <el-table-column label="微信" prop="wechatId" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center" min-width="120"></el-table-column>
        <el-table-column label="报名时间" prop="createTime" align="center" min-width="100"></el-table-column>
        <el-table-column label="状态" align="center" width="280">
          <template slot-scope="scope" prop="toDo">
            <!-- <el-button type="primary" :disabled="scope.row.isApply" size="small">已报名</el-button> -->
            <el-button type="primary" size="small" @click="comfilmWechat(scope.row.id)" v-if="scope.row.isWechat === false">确认加微信</el-button>
            <el-button type="info" size="small" @click="cancelWechat(scope.row.id)" v-else>取消加微信</el-button>
            
            <el-button type="primary" size="small" @click="comfilmPaid(scope.row.id)" v-if="scope.row.isPaid === false">确认支付</el-button>
            <el-button type="info" size="small" @click="cancelPaid(scope.row.id)" v-else>取消支付</el-button>

          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
          <el-button type="danger" size="small" icon="el-icon-close" @click="cancel(scope.row.id)" v-if="scope.row.isApply === true">取消报名</el-button>
          <el-button type="info" size="small" icon="el-icon-check" @click="replace(scope.row.id)" v-else>重新报名</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="添加活动人"
      :visible.sync="dialogVisible"
      width="25%"
      v-loading="dialog.loading"
      center>
      <el-form label-width="50px" :model="dialog.form" :rules="dialog.rules" ref="dialogForm">
        <el-form-item label="名字">
          <el-select v-model="dialog.selectUser" filterable @change="selectChange" style="width: 100%;">
            <el-option v-for="(item, $index) in userList" :key="$index" :label="item.name" :value="$index">
              <span style="float: left">{{ item.name || item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px" v-if="item.wechatId">微信号：{{ item.wechatId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" :disabled="true" v-model="dialog.form.mobilePhoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" :disabled="true" v-model="dialog.form.email"></el-input>
        </el-form-item>
        <el-form-item label="微信">
          <el-input type="text" :disabled="true" v-model="dialog.form.wechatId"></el-input>
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
      searchText: '',
      dialogVisible: false,

      tableData: [],

      userList: [],
      dialog: {
        loading: false,
        selectUser: '',
        form: {},
        rules: {},
      },
    }
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      if (this.$route.query.id) {
        this.loading = true;

        const that = this;
        let arr = [];

        var userQuery = new this.$AV.Query('_User');

        var activityPersonQuery = new this.$AV.Query('activity_person');
        activityPersonQuery.equalTo('activity', this.$AV.Object.createWithoutData('activity', that.$route.query.id));
        activityPersonQuery.find().then((ap) => {
          that.loading = false;
          for (let i = 0; i < ap.length; i += 1) {
            userQuery.get(ap[i].get('user').id).then((user) => {
              if (that.searchText) {
                if (user.get('name').indexOf(that.searchText) != -1 || user.get('mobilePhoneNumber').indexOf(that.searchText) != -1 || user.get('wechatId').indexOf(that.searchText) != -1) {
                  arr.push({
                    id: ap[i].id,
                    name: user.get('name') || '',
                    mobilePhoneNumber: user.get('mobilePhoneNumber') || '',
                    wechatId: user.get('wechatId') || '',
                    email: user.get('email') || '',
                    createTime: that.$moment(ap[i].createdAt).format('YYYY-MM-DD hh:mm'),
                    isApply: ap[i].get('isApply'),
                    isWechat: ap[i].get('isWechat'),
                    isPaid: ap[i].get('isPaid'),
                  });
                }
              } else {
                arr.push({
                  id: ap[i].id,
                  name: user.get('name') || '',
                  mobilePhoneNumber: user.get('mobilePhoneNumber') || '',
                  wechatId: user.get('wechatId') || '',
                  email: user.get('email') || '',
                  createTime: that.$moment(ap[i].createdAt).format('YYYY-MM-DD hh:mm'),
                  isApply: ap[i].get('isApply'),
                  isWechat: ap[i].get('isWechat'),
                  isPaid: ap[i].get('isPaid'),
                });
              }
            });
          }
          that.tableData = arr;
        });
      }
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
    showDialog() {
      this.dialogVisible = true;
      this.getUserList();
    },
    selectChange(i) {
      this.dialog.form = this.userList[i];
    },
    submitForm() {
      const that = this;
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.dialog.loading = true;
          var activityPersonQuery = new this.$AV.Query('activity_person');
          activityPersonQuery.equalTo('activity', this.$AV.Object.createWithoutData('activity', that.$route.query.id));
          activityPersonQuery.equalTo('user', this.$AV.Object.createWithoutData('_User', this.userList[this.dialog.selectUser].id));
          activityPersonQuery.find().then((res) => {
            that.dialog.loading = false;
            if (res.length > 0) {
              if (res[0].get('isApply') === false) {
                that.$confirm('该用户已存在取消的报名记录, 是否重新报名?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  that.$message({
                    type: 'success',
                    message: '报名成功!'
                  });
                  that.getlist();
                }).catch(() => {
                  // that.$message({
                  //   type: 'info',
                  //   message: '已取消操作'
                  // });          
                });
              } else {
                that.$message.error('该用户已报名本次活动');
                return false;
              }
            }

            var newActivityPerson = new this.$AV.Object('activity_person');
            newActivityPerson.set('activity', that.$AV.Object.createWithoutData('activity', that.$route.query.id));
            newActivityPerson.set('user', that.$AV.Object.createWithoutData('_User', that.userList[that.dialog.selectUser].id));
            newActivityPerson.set('isApply', true);

            newActivityPerson.save().then(() => {
              that.$message.success('添加成功');
              that.dialogVisible = false;
              that.getlist();
            });
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    cancel(id) {
      this.$confirm('此操作将取消该用户对本次活动的报名, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var updateActivityPerson = this.$AV.Object.createWithoutData('activity_person', id);
        updateActivityPerson.set('isApply', false);
        updateActivityPerson.save().then(() => {
          this.$message.success('取消成功！');
          this.getlist();
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消操作'
        // });          
      });
    },
    replace(id) {
      this.$confirm('此操作将为该用户重新报名本次活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var updateActivityPerson = this.$AV.Object.createWithoutData('activity_person', id);
        updateActivityPerson.set('isApply', true);
        updateActivityPerson.save().then(() => {
          this.$message.success('重新报名成功！');
          this.getlist();
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消操作'
        // });          
      });
    },
    comfilmWechat(id) {
      this.$confirm('确认加微信了吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var updateActivityPerson = this.$AV.Object.createWithoutData('activity_person', id);
        updateActivityPerson.set('isWechat', true);
        updateActivityPerson.save().then(() => {
          this.$message.success('已确认！');
          this.getlist();
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消操作'
        // });          
      });
    },
    cancelWechat(id) {
      this.$confirm('确认没有加微信吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var updateActivityPerson = this.$AV.Object.createWithoutData('activity_person', id);
        updateActivityPerson.set('isWechat', false);
        updateActivityPerson.save().then(() => {
          this.$message.success('已确认！');
          this.getlist();
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消操作'
        // });          
      });
    },
    comfilmPaid(id) {
      this.$confirm('确认该用户已支付吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var updateActivityPerson = this.$AV.Object.createWithoutData('activity_person', id);
        updateActivityPerson.set('isPaid', true);
        updateActivityPerson.save().then(() => {
          this.$message.success('已确认！');
          this.getlist();
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消操作'
        // });          
      });
    },
    cancelPaid(id) {
      this.$confirm('确认该用户取消支付吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var updateActivityPerson = this.$AV.Object.createWithoutData('activity_person', id);
        updateActivityPerson.set('isPaid', false);
        updateActivityPerson.save().then(() => {
          this.$message.success('已确认！');
          this.getlist();
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消操作'
        // });          
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
  .el-button--primary.is-disabled {
    background-color: #EBEBEB;
    color: #333;
    border-color: #ebebeb;
  }
</style>
