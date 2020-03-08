<template>
  <div class="product-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>产品列表</el-breadcrumb-item>
          <el-breadcrumb-item>用户推荐列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="登录用户">
          <template slot-scope="scope">
            <template v-if="scope.row.user">
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
            <template v-else>
              <span style="color: #999;">该用户未登录</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="称呼">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="wechatId"
          label="微信号">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="提交时间">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;

      var recommendQuery = this.$Bmob.Query('recommend');
      recommendQuery.include('user','user');
      recommendQuery.find().then((res) => {
        this.loading = false;
        this.tableData = res;
      });
    },
  },
}
</script>

<style lang="scss" scoped>
  .product-layer {
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