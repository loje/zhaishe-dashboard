<template>
  <div class="applicants">
    <div class="page-top">
      <span class="top-title">管理活动人</span>
      <div class="top-func">
        <!-- <el-button type="primary" class="add-btn" @click="showItem">增加</el-button> -->
        <el-input class="search-input" v-model="searchText" placeholder="请输入内容"></el-input>
        <el-button type="text" class="search-btn">搜索</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table :data="tableData">
        <el-table-column label="名字" prop="name" align="center"></el-table-column>
        <el-table-column label="电话" prop="mobilePhoneNumber" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="微信" prop="wechatId" align="center"></el-table-column>
        <el-table-column label="已参加" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.joinList.length > 0">
              <span v-for="item in scope.row.joinList" :key="item.value" >{{item.label}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="累计缴费" align="center" prop="totalFee"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="edit(scope.row)">编辑</el-button>
            <!-- <el-button type="danger" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="添加活动人"
      :visible.sync="dialogVisible"
      width="25%"
      center>
      <el-form :model="itemform" :rules="itemrules" label-width="80px" label-position="right" ref="itemform">
        <el-form-item label="名字" prop="name">
          <el-input v-model="itemform.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobilePhoneNumber">
          <el-input v-model="itemform.mobilePhoneNumber" type="text" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="itemform.email" type="text"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wechatId">
          <el-input v-model="itemform.wechatId" type="text" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="参与期数" prop="applylist">
          <el-select v-model="itemform.applylist" multiple placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in activityList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
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
      searchText: '',
      dialogVisible: false,

      tableData: [],

      itemform: {},
      itemrules: {
        name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
      },
      activityList: [],
    }
  },
  mounted() {
    this.getPerson();
  },
  methods: {
    getPerson() {
      const that = this;
      var userQuery = new this.$AV.Query('_User');
      userQuery.find().then((user) => {
        const arr = [];

        for (let i = 0; i < user.length; i += 1) {
          arr.push({
            name: user[i].get('name') || '',
            mobilePhoneNumber: user[i].get('mobilePhoneNumber') || '',
            wechatId: user[i].get('wechatId') || '',
            email: user[i].get('email') || '',
            totalFee: 0,
            joinList: [],
            userId: user[i].id,
          });

          var activityPersonQuery = new that.$AV.Query('activity_person');
          activityPersonQuery.equalTo('user', user[i]);
          activityPersonQuery.find().then((ap) => {
            for (let o = 0; o < ap.length; o += 1) {
              var activityQuery = new that.$AV.Query('activity');
              activityQuery.get(ap[o].get('activity').id).then((ac) => {
                arr[i].totalFee = ac.get('fee') + arr[i].totalFee;
                arr[i].joinList.push({
                  label: ac.get('title'),
                  value: ac.id,
                });
              });
            }
            // console.log(arr[i].joinList);
          });
        }

        this.tableData = arr;
      });
    },

    getActivityList() {
      const that = this;
      var activityQuery = new that.$AV.Query('activity');
      activityQuery.find().then((act) => {
        const arr = [];
        for (let i = 0; i < act.length; i += 1) {
          arr.push({
            label: act[i].get('title'),
            value: act[i].id,
          });
        }
        that.activityList = arr;
      });
    },

    showItem() {
      this.dialogVisible = true;
      this.getActivityList();
    },

    edit(item) {
      this.dialogVisible = true;
      this.getActivityList();
      
      const selects = [];
      for (let i = 0; i < item.joinList.length; i += 1) {
        selects.push(item.joinList[i].value);
      }
      this.itemform = {
        ...item,
        applylist: selects,
        joinList: undefined,
      };
    },
    submitForm() {
      const that = this;
      this.$refs.itemform.validate((valid) => {
        if (valid) {
          // 更新用户信息
          var user = this.$AV.Object.createWithoutData('_User', that.itemform.userId);
          // user.set('name', that.itemform.name);
          // user.set('email', that.itemform.email);
          // user.save();
          
          // 更新报名信息
          // const applylist = that.itemform.applylist;
          var activityPersonQuery = new that.$AV.Query('activity_person');
          activityPersonQuery.equalTo('user', user);
          activityPersonQuery.find().then((act) => {
            console.log(act);
            // // console.log(applylist);
            // for (let i = 0; i < act.length; i += 1) {
            //   // 查询提交的报名记录中是否在数据库中是否不存在，不存在则
            //   if (applylist.indexOf(act[i].get('activity').id) === -1) {
            //     console.log(act[i].get('activity').id);
            //   }
            // }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
  .applicants {
    padding: 25px;
    background-color: #fff;
    box-sizing: border-box;
    .page-top {
      position: relative;
      padding-bottom: 50px;
      height: 40px;
      background-color: #fff;
      .top-func {
        position: absolute;
        top: 0px;
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
</style>
