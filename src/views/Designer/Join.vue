<template>
  <div class="download-list">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>加入宅设分享人</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
    <div class="layer-table">
      <el-table :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column label="称呼" prop="name"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="个人链接" prop="link"></el-table-column>
        <el-table-column label="分享主题" prop="theme"></el-table-column>
        <el-table-column label="添加时间" prop="createdAt"></el-table-column>
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
      let downloadQuery = this.$Bmob.Query('sharer');
      downloadQuery.find().then((res) => {
        this.loading = false;
        this.tableData = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
        margin: 0 15px;
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
</style>