<template>
  <div class="download-list">
    <div class="layer-table">
      <el-table>
        <el-table-column label="类别"></el-table-column>
        <el-table-column label="资源名称"></el-table-column>
        <el-table-column label="下载量"></el-table-column>
        <el-table-column label="下载链接"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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