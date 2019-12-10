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

        <div class="input-group">
          <el-input type="text" placeholder="请输入内容" v-model="searchText" clearable>
            <el-button slot="append" icon="el-icon-search" @click="dataSearch" class="el-button--primary"></el-button>
          </el-input>
        </div>
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
            <el-popover
              placement="top-start"
              trigger="hover">
              <el-image :src="scope.row.img" style="width: 150px;" fit="contain"></el-image>
              <template slot="reference">
                <div class="title">{{scope.row.title}}</div>
                <div class="desc" style="font-size:12px;color:#999;">{{scope.row.desc}}</div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="报名人数"
          prop="count"
          align="center"
          width="200">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.count/scope.row.num * 100" :show-text="false" :stroke-width="12" style="display: inline-block; width: 80px;"></el-progress>
            <span style="margin-left:10px;font-size: 12px;">{{scope.row.count}} / {{scope.row.num}}</span>
          </template>
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
            <div style="font-size:12px;">开始时间：{{scope.row.startTime}}</div>
            <div style="font-size:12px;">结束时间：{{scope.row.endTime}}</div>
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
        <el-table-column label="创建时间" prop="createdAt" min-width="200"></el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" min-width="200"></el-table-column>
        <el-table-column
          prop="toDo"
          width="550"
          label="操作">
          <template slot-scope="scope">
            <el-button type="info" size="small" icon="el-icon-s-flag" v-if="scope.row.isTop === true" @click="setTop(scope.row.id, false)">取消置顶</el-button>
            <el-button :type="scope.row.status === 1 ? 'primary' : 'info'" size="small" icon="el-icon-s-flag" v-else @click="setTop(scope.row.id, true)">首页置顶</el-button>

            <el-button :type="scope.row.status === 1 ? 'primary' : 'info'" size="small" icon="el-icon-finished" @click="audit(scope.row.id, scope.row.title)">查看已报名人</el-button>
            <el-button :type="scope.row.status === 1 ? 'primary' : 'info'" size="small" icon="el-icon-finished" @click="note(scope.row.id, scope.row.title)">会后笔记</el-button>

            <el-button-group style="margin-left: 15px;">
            <el-button size="small" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="del(scope.row.id)" :disabled="scope.row.count > 0">删除</el-button>
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
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle + ' - 会后笔记'"
      :visible.sync="dialogVisible"
      v-loading="dialogLoading"
      width="900px">
      <quill-editor v-model="dialogContent" ref="myQuillEditor" style="padding-bottom:66px;width: 100%;height:600px;"></quill-editor>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confilm">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  quillEditor
} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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

      dialogVisible: false,
      dialogContent: '',
      dialogId: '',
      dialogTitle: '',
      dialogLoading: false,

      isTops: 0,
    }
  },
  components: {
    quillEditor
  },
  activated() {
    this.getActivityList();
    this.getActivityCount();
    this.getIsTop();
  },
  methods: {
    setTop(id, boolean) {
      if (this.isTops < 4) {
        var activity = this.$AV.Object.createWithoutData('activity', id);
        activity.set('isTop', boolean);
        activity.save().then(() => {
          this.getActivityList();
          this.getIsTop();
        });
      } else {
        this.$message.error('已置顶满四个');
      }
    },
    dataSearch() {
      this.getActivityList();
    },
    getIsTop() {
      var query = new this.$AV.Query('activity');
      query.equalTo('isTop', true);
      query.count().then((count) => {
        this.isTops = count;
      });
    },
    getActivityList() {
      this.loading = true;
      const that = this;
      let dataList = [];
      var query = new this.$AV.Query('activity');
      // const skip = that.pageSize * (that.current - 1);
      query.descending('createdAt');
      // query.equalTo('notDelete', true);
      if (that.searchText) {
        query.contains('title', that.searchText);
      }
      // query.limit(that.pageSize);
      // query.skip(skip);
      query.find().then((data) => {
        that.loading = false;
        for (let i = 0; i < data.length; i += 1) {
          var activityPersonQuery = new this.$AV.Query('activity_person');
          activityPersonQuery.equalTo('isApply', true);
          activityPersonQuery.equalTo('activity', this.$AV.Object.createWithoutData('activity', data[i].id));
          activityPersonQuery.count().then((count) => {
            dataList.push({
              id: data[i].id,
              img: data[i].get('imgSrc'),
              title: data[i].get('title'),
              desc: data[i].get('desc'),
              count: count,
              num: data[i].get('number'),
              pv: data[i].get('pv'),
              startTime: that.$moment(data[i].get('startTime')).format('YYYY-MM-DD HH:mm'),
              endTime: that.$moment(data[i].get('endTime')).format('YYYY-MM-DD HH:mm'),
              status: data[i].get('status'),
              isTop: data[i].get('isTop'),
              createdAt: that.$moment(data[i].get('createdAt')).format('YYYY-MM-DD HH:mm'),
              updatedAt: that.$moment(data[i].get('updatedAt')).format('YYYY-MM-DD HH:mm'),
            });
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
    handleSizeChange(page) {
      this.current = 1;
      this.pageSize = page;
      this.getActivityList();
    },
    handleCurrentChange(current) {
      this.current = current;
      this.getActivityList();
    },
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
    audit(id, title) {
      this.$router.push({
        path: '/activity/audit',
        query: {
          id,
          title
        },
      });
    },
    note(id, title) {
      this.dialogTitle = title;
      this.dialogId = id;
      this.dialogVisible = true;

      this.dialogLoading = true;
      var query = new this.$AV.Query('activity');
      query.get(id).then((data) => {
        this.dialogLoading = false;
        this.dialogContent = data.get('note');
      });
    },
    confilm() {
      this.dialogLoading = true;
      let activity = this.$AV.Object.createWithoutData('activity', this.dialogId);
      activity.set('note', this.dialogContent);
      activity.save().then(() => {
        this.dialogLoading = false;
        this.dialogTitle = '';
        this.dialogId = '';
        this.dialogVisible = false;
        this.$message.success('编辑成功！');
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
