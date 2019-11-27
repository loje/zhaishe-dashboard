<template>
  <div class="applicants">
    <div class="page-top">
      <span class="top-title">管理活动人</span>
      <div class="top-func">
        <el-button type="primary" class="add-btn" @click="dialogVisible = true">增加</el-button>
        <el-input class="search-input" v-model="searchText" placeholder="请输入内容"></el-input>
        <el-button type="text" class="search-btn">搜索</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table :data="tableData">
        <el-table-column label="名字" align="center"></el-table-column>
        <el-table-column label="电话" align="center"></el-table-column>
        <el-table-column label="邮箱" align="center"></el-table-column>
        <el-table-column label="微信" align="center"></el-table-column>
        <el-table-column label="已参加" align="center"></el-table-column>
        <el-table-column label="累计缴费" align="center"></el-table-column>
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
      searchText: '',
      dialogVisible: false,

      tableData: [],
    }
  },
  mounted() {
    this.getPerson();
  },
  methods: {
    getPerson() {
      const that = this;
      var userQuery = new this.$AV.Query('_User');
      var activityPersonQuery = new this.$AV.Query('activity_person');

      userQuery.find().then(function (user) {
        for(let x = 0; x < user.length; x += 1) {
          var post = that.$AV.Object.createWithoutData('_User', user[x].id);
          activityPersonQuery.equalTo('user', post);
          activityPersonQuery.find().then((act) => {
            console.log(act);
          });
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
