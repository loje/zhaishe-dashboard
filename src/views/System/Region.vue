<template>
  <div class="friend-page">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>全国地址库</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>

    <ul>
      <template v-for="(item, $index) in tableData">
      <li :key="$index" v-if="item.id.length < 3">{{item.id}}</li>
      </template>
    </ul>

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: false,
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;
      let linkQuery = this.$Bmob.Query('region');
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
            if(this.linkList.length === 4) {
              this.$message.error('最多只能有4条友情链接');
              return false;
            }
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