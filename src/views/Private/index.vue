<template>
  <div class="private-list">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>私单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <!-- <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="edit('新建')">新建私单</el-button>
      </div> -->
    </div>
    <div class="layer-table">
      <el-table :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="登录用户">
          <template slot-scope="scope">
            <template v-if="scope.row.user">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover">
              <div style="margin-bottom: 10px;"><span style="color:#999;">微信号：</span>{{scope.row.user['wechatId']}}</div>
              <div style="margin-bottom: 10px;"><span style="color:#999;">电话：</span>{{scope.row.user['mobilePhoneNumber']}}</div>
              <div style="margin-bottom: 10px;"><span style="color:#999;">姓名：</span>{{scope.row.user['name']}}</div>
              <div><span style="color:#999;">邮箱：</span>{{scope.row.user['email']}}</div>
              <span slot="reference">{{scope.row.user['username']}}</span>
            </el-popover>
            </template>
            <template v-else>
              <span style="color: #999;">该用户未登录</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="名字" prop="name"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="微信号" prop="wechatId"></el-table-column>
        <el-table-column label="类型" prop="sort"></el-table-column>
        <el-table-column label="发布时间" prop="createdAt"></el-table-column>
        <el-table-column label="描述" prop="remark"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" size="small" @click="edit('通过审核', scope.row)" v-if="!scope.row.audit || scope.row.audit === false">通过审核</el-button>
            <el-button type="info" icon="el-icon-close" size="small" @click="edit('驳回审核', scope.row)" v-else>驳回审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :visible="dialogVisible" :title="dialogTitle" @close="dialogClose" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" >
        <el-form-item label="私单名字" prop="title">
          <el-input type="text" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="私单要求" prop="content">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfilm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      searchText: '',
      tableData: [],

      dialogVisible: false,
      dialogTitle: '',
      form: {},
      rules: {
        title: [{required: true, message: '请输入私单名字', trigger: 'blur' }],
        content: [{required: true, message: '请输入私单要求', trigger: 'blur' }],
      },
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    edit(type, item) {
      console.log(type, item);

      // this.dialogVisible = true;
      // switch (type) {
        // case '新建':
        //   this.dialogTitle = '新建私单';
        //   break;
        // case '编辑':
        //   this.dialogTitle = '编辑私单';
        //   this.form = {
        //     id: item.objectId,
        //     title: item.title,
        //     content: item.content
        //   };
        //   break;
      //   default:
      //     break;
      // }

      const query = this.$Bmob.Query('private_orders');
      query.get(item.objectId).then(privateOrder => {
        privateOrder.set('audit', type === '通过审核' ? true : false);
        privateOrder.set('online', type === '通过审核' ? true : false);
        privateOrder.save().then(() => {
          this.getlist();
        });
      });
    },
    getlist() {
      this.loading = true;
      let privateQuery = this.$Bmob.Query('private_orders');
      privateQuery.include('user','user');
      privateQuery.equalTo('notDelete', '==', true);
      privateQuery.find().then((res) => {
        this.loading = false;
        this.tableData = res;
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    dialogConfilm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.id) {
            const query = this.$Bmob.Query('private_orders');
            if(this.form.title) {
              query.set('title', this.form.title);
            }

            if(this.form.content) {
              query.set('content', this.form.content);
            }

            query.save().then(() => {
              this.dialogVisible = false;
              this.$refs.form.resetFields();
              this.$message.success('添加成功！');
              this.getlist();
            }),(error) => {
              console.log(error);
              // this.dialogVisible = false;
            };
          } else {
            const query = this.$Bmob.Query('private_orders');
            query.set('id', this.form.id);
            if(this.form.title) {
              query.set('title', this.form.title);
            }

            if(this.form.content) {
              query.set('content', this.form.content);
            }

            query.save().then(() => {
              this.dialogVisible = false;
              this.$refs.form.resetFields();
              this.$message.success('编辑成功！');
              this.getlist();
            }),(error) => {
              console.log(error);
              // this.dialogVisible = false;
            };
          }
        }
      });
    },
    del(id) {
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var query = this.$Bmob.Query('private_orders');
        query.set('id', id);
        query.set('notDelete', false);
        query.save().then(() => {
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