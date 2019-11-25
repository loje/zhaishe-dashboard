<template>
  <div class="activity-layer">
    <template v-if="$route.path === '/activity'">
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
        height="100%"
        style="width: 100%"
        v-loading="loading">
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
            <span v-if="scope.row.status === 0">暂存中</span>
            <span v-if="scope.row.status === 1">可报名</span>
            <span v-else-if="scope.row.status === 2">报名结束</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="toDo"
          align="center"
          min-width="150">
          <template slot-scope="scope">
            <el-button-group>
            <el-button size="medium" @click="edit(scope.row.cid)">编辑</el-button>
            <el-button type="primary" size="medium" @click="audit(scope.row.cid)">审核报名</el-button>
            <el-button type="danger" size="medium" icon="el-icon-delete" circle @click="del(scope.row.cid)" v-if="scope.row.count === 0"></el-button>
            </el-button-group>
          </template>
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
    </template>
    <template v-else>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </template>
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
      loading: false,
    }
  },
  activated() {
    this.getUserCount();
    this.getDownloadCount();
    this.getProductCount();
    this.getActivityList();
    this.getActivityCount();
  },
  methods: {
    getUserCount() {
      const that = this;
      var query = new this.$AV.Query('_User');
      query.equalTo('isCustomer', true);
      query.count().then(function (count) {
        that.allUserCount = count;
      });
    },
    getDownloadCount() {
      const that = this;
      let count = 0;
      var query = new this.$AV.Query('download');
      query.find().then(function (data) {
        for (let i = 0; i < data.length; i += 1) {
          count += data[i].attributes.downloads;
        }
        that.downloadCount = count;
      });
    },
    getProductCount() {
      const that = this;
      var query = new this.$AV.Query('product');
      query.count().then(function (count) {
        that.productCount = count;
      });
    },
    getActivityList() {
      this.loading = true;
      const that = this;
      let dataList = [];
      var query = new this.$AV.Query('activity');
      query.find().then(function (data) {
        that.loading = false;
        for (let i = 0; i < data.length; i += 1) {
          dataList.push({
            cid: data[i].id,
            title: data[i].attributes.title,
            desc: data[i].attributes.desc,
            count: data[i].attributes.count,
            pv: data[i].attributes.pv,
            time: that.$moment(data[i].attributes.time).format('YYYY-MM-DD hh:mm'),
            status: data[i].attributes.status,
          });
        }
        that.tableData = dataList;
      });
    },
    getActivityCount() {
      const that = this;
      var query = new this.$AV.Query('activity');
      query.count().then(function (count) {
        that.total = count;
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    edit(cid) {
      // console.log(id);
      this.$router.push({
        path: '/activity/pulish',
        query: { cid },
      })
    },
    del(cid) {
      const that = this;
      this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var activity = this.$AV.Object.createWithoutData('activity', cid);
        activity.destroy().then(() => {
          that.$message.success('删除成功！');
          that.getActivityList();
          that.getActivityCount();
        });
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      
    },
  },
}
</script>

<style lang="scss" scope>
  .activity-layer {
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
