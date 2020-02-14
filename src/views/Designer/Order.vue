<template>
  <div>
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>严选人列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.query.name}}的接单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
    <div class="layer-table">
      <el-table :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column label="称呼" prop="name"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="需求" prop="content"></el-table-column>
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
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;
      let orderQuery = this.$Bmob.Query('sharer_order');
      orderQuery.equalTo("sharerId","==", this.$route.query.id);
      orderQuery.find().then((res) => {
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
