<template>
  <div class="channel">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="danger" class="del-btn" v-if="multipleSelection.length > 1">批量删除</el-button>
        <el-input class="search-input" v-model="searchText" placeholder="请输入内容"></el-input>
        <el-button type="text" class="search-btn">搜索</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="活动名字" prop="title"></el-table-column>
        <el-table-column label="渠道人数量" align="center" prop="channelCount"></el-table-column>
        <!-- <el-table-column label="报名数量" align="center" prop="applyCount"></el-table-column> -->
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.startTime}}</div>
            <div>{{scope.row.endTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="view(scope.row.id, scope.row.title)" size="small" icon="el-icon-view">查看</el-button>
            <!-- <el-button type="danger" @click="del(scope.row.id)" size="small">删除</el-button> -->
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      tableData: [],
      multipleSelection: [],
    }
  },
  activated() {
    this.getActivityList();
  },
  methods: {
    getActivityList() {
      // this.loading = true;
      // let dataList = [];
      // var query = this.$Bmob.Query('activity');
      // query.order('-updatedAt');
      // query.find().then((data) => {
      //   this.loading = false;
      //   for (let i = 0; i < data.length; i += 1) {
      //     var channelQuery = this.$Bmob.Query('channel');
      //     channelQuery.equalTo('activity', data[i]);
      //     channelQuery.find().then((channel) => {
      //       dataList.push({
      //         id: data[i].objectId,
      //         title: data[i].title,
      //         startTime: this.$moment(data[i].attributes.startTime).format('YYYY-MM-DD HH:mm'),
      //         endTime: this.$moment(data[i].attributes.endTime).format('YYYY-MM-DD HH:mm'),
      //         channelCount: channel.length,
      //       });
      //     });
      //   }
      //   this.tableData = dataList;
      // });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    view(activityid, title) {
      this.$router.push({
        path: '/activity/channel/item',
        query: { activityid, title },
      });
    },
  },
};
</script>

<style lang="scss" scope>
  .channel {
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
        .del-btn {
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