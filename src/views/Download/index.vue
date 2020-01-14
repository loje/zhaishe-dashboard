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
        <el-table-column label="资源名称" prop="title"></el-table-column>
        <el-table-column label="作者" prop="author"></el-table-column>
        <el-table-column label="下载数" prop="downloads"></el-table-column>
        <el-table-column label="链接" prop="link"></el-table-column>
        <el-table-column label="网盘密码" prop="code"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" @click="edit('编辑', scope.row.objectId)" size="small">编辑</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="del(scope.row.objectId)" size="small">删除</el-button>
            </el-button-group>
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
          this.$router.push('/download/item');
          break;
        case '编辑':
          this.$router.push({
            path: '/download/item',
            query: {
              id,
            },
          });

          break;
        case '资源设置':
          this.$router.push({
            path: '/download/profile',
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
      let downloadQuery = this.$Bmob.Query('download');
      downloadQuery.equalTo('notDelete', '==', true);
      if (this.searchText != '') {
        downloadQuery.equalTo('title', '===', this.searchText);
      }
      downloadQuery.find().then((res) => {
        this.loading = false;
        this.tableData = res;
      });
    },
    del(id) {
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var downloadQuery = this.$Bmob.Query('download');
        downloadQuery.set('id', id);
        downloadQuery.set('notDelete', false);
        downloadQuery.save().then(() => {
          this.$message.success('删除成功！');
          this.getlist();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
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