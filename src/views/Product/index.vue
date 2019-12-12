<template>
  <div class="product-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>产品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/product/item')">新建产品</el-button>

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
          label="产品名"
          prop="title"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="购买人数"
          prop="buyers"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="原价格"
          prop="original"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="优惠价/团购价"
          prop="preferential"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="首页推荐"
          prop="isTop"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="250">
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
      loading: false,
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    dataSearch() {},
    getlist() {
      let productQuery = this.$Bmob.Query('product');
      productQuery.find().then((res) => {
        this.tableData = res;
      });
    },
  },
};
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
