<template>
  <div class="home">
    <div class="box-group">
      <div class="box">
        <div class="box-flex">
          <span class="box-t">平台用户</span>
          <span class="box-num">{{allUserCount}}</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">付费用户</span>
          <span class="box-num">1000</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">下载数</span>
          <span class="box-num">{{downloadCount}}</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">活动参与人数</span>
          <span class="box-num">1000</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">代理产品</span>
          <span class="box-num">{{productCount}}</span>
        </div>
      </div>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-row-style="{ height: '72px'}">
        <el-table-column
          label="活动标题"
          prop="title">
          <template slot-scope="scope">
            <div class="title">{{scope.row.title}}</div>
            <div class="desc">{{scope.row.desc}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="报名人数"
          prop="count"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          prop="pv"
          label="浏览量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time"
          label="活动时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">可报名</span>
            <span v-else-if="scope.row.status === 1">报名结束</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="100"
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
      allUserCount: 0,
      downloadCount: 0,
      productCount: 0,
      tableData: [],
      current: 1,
      total: 0,
    }
  },
  mounted() {
    // this.getUserCount();
    // this.getDownloadCount();
    // this.getProductCount();
    this.getActivityList();
  },
  methods: {
    getUserCount() {
      // const that = this;
      var query = this.$Bmob.Query('_User');
      // query.equalTo('isCustomer', true);
      query.find().then((count) => {
        console.log(count);
        // that.allUserCount = count;
      });
    },
    getDownloadCount() {
      const that = this;
      let count = 0;
      var query = this.$Bmob.Query('download');
      query.find().then(function (data) {
        for (let i = 0; i < data.length; i += 1) {
          count += data[i].attributes.downloads;
        }
        that.downloadCount = count;
      });
    },
    getProductCount() {
      const that = this;
      var query = this.$Bmob.Query('product');
      query.count().then(function (count) {
        that.productCount = count;
      });
    },
    getActivityList() {
      // const that = this;
      // let dataList = [];
      var query = this.$Bmob.Query('activity');
      query.find().then((data) => {
        console.log(data);
        // for (let i = 0; i < data.length; i += 1) {
        //   dataList.push({
        //     title: data[i].attributes.title,
        //     desc: data[i].attributes.desc,
        //     count: data[i].attributes.count,
        //     pv: data[i].attributes.pv,
        //     time: that.$moment(data[i].attributes.time).format('YYYY-MM-DD hh:mm'),
        //     status: data[i].attributes.status,
        //   });
        // }
        // that.tableData = dataList;
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
  },
}
</script>

<style lang="scss" scope>
  .home {
    width: 100%;
    height: 100%;
    .box-group {
      display: flex;
      width: 100%;
      margin-bottom: 37px;
      justify-content: space-between;
      .box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 300px;
        height: 100px;
        background-color: #fff;
        text-align: center;
        .box-flex {
          .box-t {
            line-height: 17px;
            color: #999;
          }
          .box-num {
            margin-left: 20px;
            font-size: 40px;
            line-height: 40px;
            font-family: PingFang SC Regular;
            color: #333;
          }
        }
      }
    }
    .layer-table {
      width: 100%;
      height: calc(100% - 231px);
      background-color:#fff;
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
