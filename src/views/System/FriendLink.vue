<template>
  <div class="friend-page">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>友情链接（当前共{{tableData.length}}条友情链接）</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="edit('新建')">新建</el-button>
      </div>
    </div>

    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="链接图片"
          prop="src"
          min-width="250">
          <template slot-scope="scope">
            <el-image :src="scope.row.src" fit="cover" style="width: 32px; height: 32px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="链接名"
          prop="title"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="指向链接"
          prop="link"
          min-width="250"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="320">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" size="small" @click="edit('编辑', scope.row.objectId)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row.objectId)" size="small" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="form.objectId ? '编辑链接' : '新建链接'" :visible="visible" v-loading="dialogLoading" @close="visible = false" width="500px">
      <el-form :model="form" :rules="rules" label-width="80px" label-position="right" ref="form">
        <el-form-item label="链接图标" prop="src">
          <div style="line-height: 40px; color:#999;">(图片长宽1比1)</div>
          <div @click="importClick" class="el-upload el-upload--picture-card" v-loading="imgLoading">
            <el-image :src="form.src" v-if="form.src" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
            <i class="el-icon-plus" v-else></i>
            <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadFile" class="el-upload__input" :multiple="false" name="file" ref="input" type="file">
          </div>
        </el-form-item>
        <el-form-item label="链接名称" prop="title">
          <el-input type="text" v-model="form.title" placeholder="请输入链接名"></el-input>
        </el-form-item>
        <el-form-item label="指向链接" prop="link">
          <el-input type="text" v-model="form.link" placeholder="请输入链接，链接前确保有http://或https://"></el-input>
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
      tableData: [],
      loading: false,

      form: {
        src: '',
        title: '',
        link: ''
      },
      rules: {
        src: [{required: true, message: '请上传链接图标', trigger: 'blur'}],
        title: [{required: true, message: '请填写链接名称', trigger: 'blur'}],
        link: [{required: true, message: '请填写指向链接，链接前确保有http://或https://', trigger: 'blur'}],
      },
      visible: false,
      dialogLoading: false,
      imgLoading: false,
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;
      let linkQuery = this.$Bmob.Query('link');
      linkQuery.equalTo('notDelete', '===', true);
      linkQuery.find().then((res) => {
        this.loading = false;
        this.tableData = res;
      });
    },
    getinfo(id) {
      const query = this.$Bmob.Query('link');
      query.get(id).then((res) => {
        this.form = {
          objectId: res.objectId,
          title: res.title,
          src: res.src,
          link: res.link,
        };
      });
    },
    edit(type, id) {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      switch(type) {
        case '新建':
          if(this.tableData.length >= 12) {
            this.$message.warning('最多只能有12条友情链接');
            return false;
          }
          this.visible = true;
          break;
        case '编辑':
          this.visible = true;
          this.getinfo(id);
          break;
        default:
          break;
      }
    },
    del(id) {
      const query = this.$Bmob.Query('link');
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
          this.form.src = file[0].url;
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
          if (!this.form.objectId) {
            console.log(this.tableData.length);
            this.dialogLoading = true;
            const query = this.$Bmob.Query('link');
            if(this.form.src) {
              query.set('src', this.form.src);
            }
            if(this.form.title) {
              query.set('title', this.form.title);
            }
            if(this.form.link) {
              query.set('link', this.form.link);
            }
            query.save().then(() => {
              this.dialogLoading = false;
              this.visible = false;
              this.getlist();
              this.$message.success('添加成功！');
            });
          } else {
            console.log(this.form);
            this.dialogLoading = true;
            const query = this.$Bmob.Query('link');
            query.set('id', this.form.objectId)
            if(this.form.src) {
              query.set('src', this.form.src);
            }
            if(this.form.title) {
              query.set('title', this.form.title);
            }
            if(this.form.link) {
              query.set('link', this.form.link);
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
  },
};
</script>

<style lang="scss" scoped>
  .friend-page {
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
  }
</style>