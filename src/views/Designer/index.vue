<template>
  <div class="desinger">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>严选人列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="edit('新建')">新建</el-button>

        <div class="input-group">
          <el-input type="text" placeholder="请输入严选人名字" v-model="searchText" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getlist" class="el-button--primary"></el-button>
          </el-input>
        </div>
      </div>
    </div>

    <div class="layer-table">
      <el-table :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column label="个人照片" prop="img">
          <template slot-scope="scope">
            <el-image :src="scope.row.img" style="width:70px;height:100px;" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="严选人" prop="name"></el-table-column>
        <el-table-column label="介绍" prop="info"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="setTop(scope.row.objectId, true)" size="small" v-if="scope.row.isTop === false">置顶</el-button>
            <el-button type="info" @click="setTop(scope.row.objectId, false)" size="small" v-else>取消置顶</el-button>


            <el-button type="warning" @click="edit('编辑', scope.row.objectId)" size="small">编辑</el-button>
            <el-button type="danger" @click="del(scope.row.objectId)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="编辑严选人" :visible="visible" v-loading="dialogLoading" @close="visible = false" width="500px">
      <el-form :model="dialogForm" :rules="rules" label-width="80px" label-position="right" ref="form">
        <el-form-item label="名字" prop="name">
          <el-input type="text" v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="个人链接" prop="link">
          <el-input type="text" v-model="dialogForm.link" placeholder="http://或https://开头"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="info">
          <el-input type="textarea" v-model="dialogForm.info"></el-input>
        </el-form-item>
        <el-form-item label="照片" prop="img">
          <div style="line-height: 40px; color:#999;">(图片长宽4比5)</div>
          <div @click="importClick" class="el-upload el-upload--picture-card" v-loading="imgLoading">
            <el-image :src="dialogForm.img" v-if="dialogForm.img" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
            <i class="el-icon-plus" v-else></i>
            <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadFile" class="el-upload__input" :multiple="false" name="file" ref="input" type="file">
          </div>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="confilm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      loading: false,
      tableData: [],

      dialogLoading: false,
      visible: false,
      dialogForm: {},
      rules: {
        img: [{required: true, message: '请上传照片', trigger: 'blur'}],
        name: [{required: true, message: '请填写名字', trigger: 'blur'}],
        link: [{required: true, message: '请填写个人链接', trigger: 'blur'}],
        info: [{required: true, message: '请填写介绍', trigger: 'blur'}],
      },

      imgLoading: false,

      isTops: 0,
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;
      let designerQuery = this.$Bmob.Query('designer');
      if (this.searchText != '') {
        designerQuery.equalTo('name', '===', this.searchText);
      }
      designerQuery.equalTo('notDelete', '===', true);
      designerQuery.find().then((res) => {
        this.loading = false;
        this.tableData = res;
        this.getIsTop();
      });
    },
    getinfo(id) {
      const query = this.$Bmob.Query('designer');
      query.get(id).then((res) => {
        this.dialogForm = {
          objectId: res.objectId,
          name: res.name,
          img: res.img,
          info: res.info,
          link: res.link ? res.link : undefined,
        };
      });
    },
    edit(type, id) {
      this.visible = true;
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      switch(type) {
        case '新建':
          break;
        case '编辑':
          this.getinfo(id);
          break;
        default:
          break;
      }
    },
    del(id) {
      const query = this.$Bmob.Query('designer');
      query.set('id', id);
      query.set('notDelete', false);
      query.save().then(() => {
        this.$message.success('删除成功！');
        this.getlist();
      });
    },

    importClick() {
      this.imgLoading = false;
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    uploadFile(e) {
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (e.target.files[0].size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(e.target.files[0].size / 1024)}kb,上传文件不得超过500kb`);
          return false;
        }
        this.imgLoading = true;
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          this.imgLoading = false;
          this.dialogForm.img = file[0].url;
        }, () => {
          this.imgLoading = false;
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
      }
    },
    confilm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.dialogForm.objectId) {
            this.dialogLoading = true;
            const query = this.$Bmob.Query('designer');
            if(this.dialogForm.img) {
              query.set('img', this.dialogForm.img);
            }
            if(this.dialogForm.name) {
              query.set('name', this.dialogForm.name);
            }
            if(this.dialogForm.link) {
              query.set('link', this.dialogForm.link);
            }
            if(this.dialogForm.info) {
              query.set('info', this.dialogForm.info);
            }
            query.save().then(() => {
              this.dialogLoading = false;
              this.visible = false;
              this.getlist();
              this.$message.success('添加成功！');
            });
          } else {
            this.dialogLoading = true;
            const query = this.$Bmob.Query('designer');
            query.set('id', this.dialogForm.objectId)
            if(this.dialogForm.img) {
              query.set('img', this.dialogForm.img);
            }
            if(this.dialogForm.name) {
              query.set('name', this.dialogForm.name);
            }
            if(this.dialogForm.link) {
              query.set('link', this.dialogForm.link);
            }
            if(this.dialogForm.info) {
              query.set('info', this.dialogForm.info);
            }
            query.save().then(() => {
              this.dialogLoading = false;
              this.visible = false;
              this.getlist();
              this.$message.success('编辑成功！');
            });
          }
        }
      });
    },
    setTop(id, boolean) {
      if (this.isTops >= 5 && boolean === true) {
        this.$message.warning('最多置顶5个');
        return false;
      }
      const query = this.$Bmob.Query('designer');
      query.set('id', id);
      query.set('isTop', boolean);
      query.save().then(() => {
        if (boolean === true) {
          this.$message.success('置顶成功！');
        } else {
          this.$message.success('取消置顶成功！');
        }
        this.getlist();
      });
    },
    getIsTop() {
      const query = this.$Bmob.Query('designer');
      query.equalTo('isTop', '==', true);
      query.count().then((count) => {
        this.isTops = count;
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