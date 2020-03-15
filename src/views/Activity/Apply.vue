<template>
  <div class="activity-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>用户发布的活动</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="活动标题"
          prop="title"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="phone"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="发布用户"
          min-width="250">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover">
              <div style="margin-bottom: 10px;"><span style="color:#999;">微信号：</span>{{scope.row.user['wechatId']}}</div>
              <div style="margin-bottom: 10px;"><span style="color:#999;">电话：</span>{{scope.row.user['mobilePhoneNumber']}}</div>
              <div style="margin-bottom: 10px;"><span style="color:#999;">姓名：</span>{{scope.row.user['name']}}</div>
              <div><span style="color:#999;">邮箱：</span>{{scope.row.user['email']}}</div>
              <span slot="reference">{{scope.row.user['username']}}</span>
            </el-popover>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',

      pageSize: 10,
      skip: 0,
      tableData: [],
      current: 1,
      total: 0,
      loading: false,
    }
  },
  activated() {
    this.getActivityList();
    this.getActivityCount();
  },
  methods: {
    getActivityList() {
      this.loading = true;
      var query = this.$Bmob.Query('activity_apply');
      query.include('user','user');
      const skip = this.pageSize * (this.current - 1);
      query.order('-endTime');
      query.equalTo('notDelete', '==', true);
      if (this.searchText !== '') {
        query.equalTo('title', '==', this.searchText);
      }
      query.limit(this.pageSize);
      query.skip(skip);
      query.find().then((data) => {
        this.loading = false;
        this.tableData = data;
      });
    },
    getActivityCount() {
      var query = this.$Bmob.Query('activity_apply');
      query.equalTo('notDelete', '==', true);
      query.count().then((count) => {
        this.total = count;
      });
    },
    handleSizeChange(page) {
      this.current = 1;
      this.pageSize = page;
      this.getActivityList();
    },
    handleCurrentChange(current) {
      this.current = current;
      this.getActivityList();
    },
  },
}
</script>

<style lang="scss" scope>
  .activity-layer {
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
    .pagination {
      padding: 0 50px;
      width: 100%;
      height: 50px;
      text-align: right;
      background-color:#fff;
      box-sizing: border-box;
    }
  }
</style>
