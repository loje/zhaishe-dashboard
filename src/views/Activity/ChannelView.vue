<template>
  <div class="channel">
    <div class="page-top">
      <span class="top-title">渠道管理 / {{$route.query.title}}</span>
      <div class="top-func">
        <el-button type="primary" class="add-btn" @click="dialogVisible = true">增加</el-button>
        <el-input class="search-input" v-model="searchText" placeholder="请输入内容"></el-input>
        <el-button type="text" class="search-btn">搜索</el-button>
      </div>
    </div>
    <div class="layer-table">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="渠道名字" prop="title" align="center"></el-table-column>
        <el-table-column label="报名数量" align="center"></el-table-column>
        <el-table-column label="报名费用" align="center"></el-table-column>
        <el-table-column label="优惠码" align="center"></el-table-column>
        <el-table-column label="有效时间" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.starttime}}</div>
            <div>{{scope.row.endtime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row.id)" size="small">修改</el-button>
            <el-button type="danger" @click="del(scope.row.id)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="增加渠道" :visible.sync="dialogVisible" width="25%" center>
      <el-form :model="itemform" label-position="right" label-width="80px">
        <el-form-item label="渠道名字">
          <el-input v-model="itemform.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="渠道数量">
          <el-input v-model="itemform.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="时间限制">
          <el-input v-model="itemform.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="费用">
          <el-input v-model="itemform.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="渠道码">
          <el-input v-model="itemform.name" type="text" :disabled="true">
            <el-button type="primary" slot="append">生成</el-button>
          </el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      searchText: '',
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      itemform: {},
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    edit() {},
    del() {},
  },
}
</script>

<style lang="scss" scope>
  .channel {
    padding: 25px;
    background-color: #fff;
    box-sizing: border-box;
    .page-top {
      position: relative;
      padding-bottom: 50px;
      height: 40px;
      background-color: #fff;
      .top-func {
        position: absolute;
        top: 0px;
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