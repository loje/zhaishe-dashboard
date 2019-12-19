<template>
  <div class="download-list">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>资源列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="edit('新建')">新建资源</el-button>

        <div class="input-group">
          <el-input type="text" placeholder="请输入资源标题" v-model="searchText" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getlist" class="el-button--primary"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <div class="layer-table">
      <el-table :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <!-- <el-table-column label="类别" prop="sortName"></el-table-column> -->
        <el-table-column label="资源名称" prop="title"></el-table-column>
        <el-table-column label="作者" prop="author"></el-table-column>
        <el-table-column label="下载数"></el-table-column>
        <el-table-column label="链接" prop="link"></el-table-column>
        <el-table-column label="网盘密码" prop="code"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="edit('编辑', scope.row.objectId)" size="small">编辑</el-button>
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
      loading: false,
      searchText: '',
      tableData: [],
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    edit(type, id) {
      this.visible = true;
      switch (type) {
        case '新建':
          console.log(type);
          this.$router.push('/download/item');
          break;
        case '编辑':
          console.log(type, id);
          this.$router.push({
            path: '/download/item',
            query: {
              id,
            },
          });

          break;
        default:
          break;
      }
    },
    getlist() {
      this.loading = true;
      // let sortList = [];

      // const sortQuery = this.$Bmob.Query('download_sort');
      // sortQuery.find().then((res) => {
      //   sortList = res;
      // });

      let downloadQuery = this.$Bmob.Query('download');
      if (this.searchText != '') {
        downloadQuery.equalTo('title', '===', this.searchText);
      }
      downloadQuery.find().then((res) => {
        this.loading = false;
        // for (let i = 0; i < res.length; i += 1) {
        //   for (let j = 0; j < sortList.length; j += 1) {
        //     if (res[i].sort === sortList[j].objectId) {
        //       res[i].sortName = sortList[j].name;
        //     }
        //   }
        // }
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
</style>