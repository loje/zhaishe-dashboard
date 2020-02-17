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
        <!-- <el-button type="primary" class="add-btn" icon="el-icon-plus" @click="showDialog">添加</el-button> -->
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
        <el-table-column label="支付金额" prop="total_fee" align="center" min-width="100"></el-table-column>
        <el-table-column label="支付状态" prop="trade_state_desc" align="center" min-width="100"></el-table-column>
        <!-- <el-table-column label="状态" align="center" width="280">
          <template slot-scope="scope" prop="toDo"> -->
            <!-- <el-button type="primary" :disabled="scope.row.isApply" size="small">已报名</el-button> -->
            <!-- <el-button type="primary" size="small" @click="comfilmWechat(scope.row.id)" v-if="scope.row.isWechat === false">确认加微信</el-button>
            <el-button type="info" size="small" @click="cancelWechat(scope.row.id)" v-else>取消加微信</el-button> -->
            
            <!-- <el-button type="primary" size="small" @click="comfilmPaid(scope.row.id)" v-if="scope.row.isPaid === false">确认支付</el-button> -->
            <!-- <el-button type="info" size="small" @click="cancelPaid(scope.row.id)" v-else>取消支付</el-button> -->

          <!-- </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="comfilmWechat(scope.row.id)" v-if="scope.row.isWechat === false">确认加微信</el-button>
            <el-button type="info" size="small" @click="cancelWechat(scope.row.id)" v-else>取消加微信</el-button>
          <el-button type="danger" size="small" icon="el-icon-close" @click="cancel(scope.row.id)" v-if="scope.row.isApply === true">取消报名</el-button>
          <el-button type="info" size="small" icon="el-icon-check" @click="replace(scope.row.id)" v-else>再次报名</el-button>
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
      this.loading = true;
      let arr = [];
      if (this.$route.query.id) {
        // let orderlist = [];
        var activityPersonQuery = this.$Bmob.Query('activity_person');
        activityPersonQuery.order('-createdAt');
        activityPersonQuery.find().then((ap) => {
          this.loading = false;
          for (let i = 0; i < ap.length; i += 1) {
            if (ap[i].activity.objectId === this.$route.query.id) {
              const userQuery = this.$Bmob.Query('_User');
              userQuery.get(ap[i].user.objectId).then((user) => {
                let orderQuery = this.$Bmob.Query('order_list');
                orderQuery.equalTo('sort', '===', 'active');
                orderQuery.find().then((orderres) => {
                  console.log(orderres);
                  for (let j = 0; j < orderres.length; j += 1) {
                    console.log(ap[i].activity.objectId);
                    if (ap[i].activity.objectId === orderres[j].activity.objectId) {
                      console.log(orderres[j]);
                      if (this.searchText != '') {
                        if (this.searchText === user.name || this.searchText === user.mobilePhoneNumber  || this.searchText === user.wechatId) {
                          arr.push({
                            id: ap[i].objectId,
                            name: user.name,
                            mobilePhoneNumber: user.mobilePhoneNumber,
                            wechatId: user.wechatId,
                            email: user.email,
                            createTime: this.$moment(ap[i].createdAt).format('YYYY-MM-DD hh:mm'),
                            isApply: ap[i].isApply,
                            isWechat: ap[i].isWechat,
                            isPaid: ap[i].isPaid,
                            total_fee: orderres[j].payReslut.total_fee,
                            trade_state_desc: orderres[j].payReslut.trade_state_desc,
                          });
                        }
                      } else {
                        arr.push({
                          id: ap[i].objectId,
                          name: user.name,
                          mobilePhoneNumber: user.mobilePhoneNumber,
                          wechatId: user.wechatId,
                          email: user.email,
                          createTime: this.$moment(ap[i].createdAt).format('YYYY-MM-DD hh:mm'),
                          isApply: ap[i].isApply,
                          isWechat: ap[i].isWechat,
                          isPaid: ap[i].isPaid,
                          total_fee: orderres[j].payReslut.total_fee,
                          trade_state_desc: orderres[j].payReslut.trade_state_desc,
                        });
                      }
                    }
                  }
                });
              });
            }
          }
          this.tableData = arr;
        });
      }
    },
    getUserList() {
      this.dialog.loading = true;
      this.userList = [];
      var userQuery = this.$Bmob.Query('_User');
      userQuery.find().then((res) => {
        this.dialog.loading = false;
        for (let i = 0; i < res.length; i += 1) {
          this.userList.push(res[i]);
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
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.dialog.loading = true;
          
          const query = this.$Bmob.Query('activity_person');
          query.equalTo('user', '==', this.userList[this.dialog.selectUser].objectId);
          query.find().then((res) => {
            this.dialog.loading = false;
            if (res.length > 0) {
              if (res[0].isApply === false) {
                this.$confirm('该用户已存在取消的报名记录, 是否重新报名?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  query.set('id', res[0].objectId);
                  query.set('isApply', true);
                  query.save().then(() => {
                    this.$message({
                      type: 'success',
                      message: '报名成功!'
                    });
                    this.dialogVisible = false;
                    this.getlist();
                  });
                });
              } else {
                this.$message.error('该用户已报名本次活动');
                return false;
              }
            } else {
              const userPointer = this.$Bmob.Pointer('_User')
              const userID = userPointer.set(this.userList[this.dialog.selectUser].objectId)
              query.set('user', userID);
              const activityPointer = this.$Bmob.Pointer('activity')
              const activityID = activityPointer.set(this.$route.query.id)
              query.set('activity', activityID);
              query.set('isApply', true);
              query.save().then(res => {
                console.log(res)
                this.$message({
                  type: 'success',
                  message: '报名成功!'
                });
                this.dialogVisible = false;
                this.getlist();
              });
            }
          });



          // var activityPersonQuery = this.$Bmob.Query('activity_person');
          // activityPersonQuery.equalTo('activity', this.$Bmob.Object.createWithoutData('activity', that.$route.query.id));
          // activityPersonQuery.equalTo('user', this.$Bmob.Object.createWithoutData('_User', this.userList[this.dialog.selectUser].id));
          // activityPersonQuery.find().then((res) => {
          //   that.dialog.loading = false;
          //   if (res.length > 0) {
          //     if (res[0].get('isApply') === false) {
          //       that.$confirm('该用户已存在取消的报名记录, 是否重新报名?', '提示', {
          //         confirmButtonText: '确定',
          //         cancelButtonText: '取消',
          //         type: 'warning'
          //       }).then(() => {
          //         that.$message({
          //           type: 'success',
          //           message: '报名成功!'
          //         });
          //         that.getlist();
          //       }).catch(() => {
          //         // that.$message({
          //         //   type: 'info',
          //         //   message: '已取消操作'
          //         // });          
          //       });
          //     } else {
          //       that.$message.error('该用户已报名本次活动');
          //       return false;
          //     }
          //   }

          //   var newActivityPerson = this.$Bmob.Object('activity_person');
          //   newActivityPerson.set('activity', that.$Bmob.Object.createWithoutData('activity', that.$route.query.id));
          //   newActivityPerson.set('user', that.$Bmob.Object.createWithoutData('_User', that.userList[that.dialog.selectUser].id));
          //   newActivityPerson.set('isApply', true);

          //   newActivityPerson.save().then(() => {
          //     that.$message.success('添加成功');
          //     that.dialogVisible = false;
          //     that.getlist();
          //   });
          // });
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
        const query = this.$Bmob.Query('activity_person');
        query.set('id', id); //需要修改的objectId
        query.set('isApply', false);
        query.save().then(res => {
          console.log(res)
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
        const query = this.$Bmob.Query('activity_person');
        query.set('id', id); //需要修改的objectId
        query.set('isApply', true);
        query.save().then(res => {
          console.log(res)
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
        const query = this.$Bmob.Query('activity_person');
        query.set('id', id); //需要修改的objectId
        query.set('isWechat', true);
        query.save().then(res => {
          console.log(res)
          this.getlist();
        });
      });
    },
    cancelWechat(id) {
      this.$confirm('确认没有加微信吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = this.$Bmob.Query('activity_person');
        query.set('id', id); //需要修改的objectId
        query.set('isWechat', false);
        query.save().then(res => {
          console.log(res)
          this.getlist();
        });
      });
    },
    comfilmPaid(id) {
      this.$confirm('确认该用户已支付吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = this.$Bmob.Query('activity_person');
        query.set('id', id); //需要修改的objectId
        query.set('isPaid', true);
        query.save().then(res => {
          console.log(res)
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
        const query = this.$Bmob.Query('activity_person');
        query.set('id', id); //需要修改的objectId
        query.set('isPaid', false);
        query.save().then(res => {
          console.log(res)
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
