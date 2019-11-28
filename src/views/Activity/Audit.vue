<template>
  <div class="applicants">
    <div class="page-top">
      <span class="top-title">{{title}}</span>
      <div class="top-func">
        <el-button type="primary" class="add-btn" @click="dialogVisible = true">增加</el-button>
        <el-input class="search-input" v-model="searchText" placeholder="请输入内容"></el-input>
        <el-button type="text" class="search-btn">搜索</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="名字" prop="name" align="center"></el-table-column>
        <el-table-column label="电话" prop="mobilePhoneNumber" align="center"></el-table-column>
        <el-table-column label="微信" prop="wechatId" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center" min-width="120"></el-table-column>
        <el-table-column label="报名时间" prop="createTime" align="center" min-width="100"></el-table-column>
        <el-table-column label="状态" align="center" min-width="200">
          <template slot-scope="scope" prop="toDo">
            <el-button type="primary" :disabled="scope.row.isApply" size="small">已报名</el-button>
            <el-button type="primary" :disabled="scope.row.isWechat" size="small">已加微信</el-button>
            <el-button type="primary" :disabled="scope.row.isPaid" size="small">已支付</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="添加活动人"
      :visible.sync="dialogVisible"
      width="25%"
      center>
      <!-- <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span> -->
      <el-form label-width="50px">
        <el-form-item label="名字" align="center">
          <el-input type="text"></el-input>
        </el-form-item>
        <el-form-item label="电话" align="center">
          <el-input type="text"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" align="center">
          <el-input type="text"></el-input>
        </el-form-item>
        <el-form-item label="微信" align="center">
          <el-input type="text"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary">添加</el-button>
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
      title: '',
      searchText: '',
      dialogVisible: false,

      tableData: [],
    }
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      const that = this;
      var activityQuery = new this.$AV.Query('activity');
      var activityPersonQuery = new this.$AV.Query('activity_person');
      var userQuery = new this.$AV.Query('_User');
      const arr = [];

      activityQuery.get(that.$route.query.id).then(function (data) {
        that.title = data.get('title');
        activityPersonQuery.equalTo('activity', data);
        activityPersonQuery.find().then((d) => {
          for (let i = 0; i < d.length; i += 1) {
            userQuery.get(d[i].get('user').id).then((res) => {
              arr.push({
                name: res.get('name') || '',
                mobilePhoneNumber: res.get('mobilePhoneNumber') || '',
                wechatId: res.get('wechatId') || '',
                email: res.get('email') || '',
                createTime: that.$moment(d[i].createdAt).format('YYYY-MM-DD hh:mm'),
                isApply: d[i].get('isApply'),
                isWechat: d[i].get('isWechat'),
                isPaid: d[i].get('isPaid'),
              });
            });
          }
          that.tableData = arr;
        });
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
      .top-title {
        line-height: 40px;
        color: #333;
      }
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
  .el-button--primary.is-disabled {
    background-color: #EBEBEB;
    color: #333;
    border-color: #ebebeb;
  }
</style>
