<template>
  <div class="home">
    <div class="box-group">
      <div class="box">
        <div class="box-flex">
          <span class="box-t">平台用户</span>
          <span class="box-num">1000</span>
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
          <span class="box-num">1000</span>
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
          <span class="box-num">10</span>
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
          align="center">
        </el-table-column>
        <el-table-column
          label="报名人数"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="浏览量">
        </el-table-column>
        <el-table-column
          align="center"
          label="活动时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
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
      tableData: [],
      current: 1,
      total: 0,
    }
  },
  methods: {
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
