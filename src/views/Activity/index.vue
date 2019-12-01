<template>
  <div class="activity-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/activity/pulish')">新建活动</el-button>
      </div>
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
          <template slot-scope="scope">
            <div class="title">{{scope.row.title}}</div>
            <!-- <div class="desc">{{scope.row.desc}}</div> -->
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
          label="活动时间"
          min-width="200">
          <template slot-scope="scope">
            <div>开始时间：{{scope.row.startTime}}</div>
            <div>结束时间：{{scope.row.endTime}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <div class="state" v-if="scope.row.status === 0">
              <span class="icon" style="background-color: #999;"></span>
              <span class="text">暂存中</span>
            </div>
            <div class="state" v-else-if="scope.row.status === 1">
              <span class="icon" style="background-color: #FFCB2B;"></span>
              <span class="text">可报名</span>
            </div>
            <div class="state" v-else-if="scope.row.status === 2">
              <span class="icon" style="background-color: #999;"></span>
              <span class="text">报名结束</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="toDo"
          align="center"
          width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-finished" @click="audit(scope.row.id)">审核报名</el-button>
            <el-button-group style="margin-left: 15px;">
            <el-button size="small" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="del(scope.row.id)" v-if="scope.row.count === 0">删除</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      current: 1,
      total: 0,
      loading: false,
    }
  },
  mounted() {

    this.getActivityList();
    this.getActivityCount();
  },
  methods: {
    getActivityList() {
      this.loading = true;
      const that = this;
      let dataList = [];
      var query = new this.$AV.Query('activity');
      query.equalTo('notDelete', true);
      query.ascending('updatedAt');
      query.find().then((data) => {
        that.loading = false;
        for (let i = 0; i < data.length; i += 1) {
          dataList.push({
            id: data[i].id,
            title: data[i].attributes.title,
            desc: data[i].attributes.desc,
            count: data[i].attributes.count,
            pv: data[i].attributes.pv,
            startTime: that.$moment(data[i].attributes.startTime).format('YYYY-MM-DD hh:mm'),
            endTime: that.$moment(data[i].attributes.endTime).format('YYYY-MM-DD hh:mm'),
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
    edit(id) {
      this.$router.push({
        path: '/activity/pulish',
        query: { id },
      })
    },
    del(id) {
      const that = this;
      this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var activity = this.$AV.Object.createWithoutData('activity', id);
        activity.set('notDelete', false);
        activity.save().then(() => {
          that.$message.success('删除成功！');
          that.getActivityList();
          that.getActivityCount();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    audit(id) {
      this.$router.push({
        path: '/activity/audit',
        query: {
          id,
        },
      });
    },
  },
}
</script>

<style lang="scss" scope>
  .state {
    .icon {
      display: inline-block;
      margin-right: 10px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
    }
  }
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
  }
</style>
