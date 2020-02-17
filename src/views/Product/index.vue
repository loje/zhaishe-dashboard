<template>
  <div class="product-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>产品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="edit('新建')">新建产品</el-button>

        <div class="input-group">
          <el-input type="text" placeholder="请输入标题" v-model="searchText" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getlist" class="el-button--primary"></el-button>
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
          prop="price"
          min-width="250"
          align="center">
        </el-table-column>
        <el-table-column
          label="优惠价/团购价"
          prop="groupPrice"
          min-width="250"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          width="400">
          <template slot-scope="scope">
            <el-button type="info" size="small" icon="el-icon-s-flag" v-if="scope.row.recommend === true" @click="setTop(scope.row.objectId, false)">取消置顶</el-button>
            <el-button type="primary" size="small" icon="el-icon-s-flag" v-else @click="setTop(scope.row.objectId, true)">首页置顶</el-button>

            <el-button type="warning" icon="el-icon-edit" size="small" @click="edit('编辑', scope.row.objectId)">编辑</el-button>

            <el-button type="info" icon="el-icon-sunny" size="small" @click="setSell(scope.row.objectId, 0)" v-if="scope.row.status === -1">上架</el-button>
            <el-button type="primary" icon="el-icon-cloudy-and-sunny " size="small" @click="setSell(scope.row.objectId, -1)" v-if="scope.row.status === 0">下架</el-button>

            <el-button type="danger" @click="del(scope.row.objectId)" size="small" icon="el-icon-delete" v-if="scope.row.notDelete === true">删除</el-button>
            <el-button type="info" @click="replace(scope.row.objectId)" icon="el-icon-refresh-left" size="small" v-else>恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <el-dialog :visible.sync="visible" :title="`产品${dialogTitle}`" width="25%" @close="close">
      <el-form :model="form" label-position="right" label-width="100px" :rules="rules" class="form" ref="form" v-loading="loading">
        <el-form-item label="产品标题" prop="title">
          <el-input type="text" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="产品介绍" prop="desc">
          <el-input type="textarea" v-model="form.desc" rows="3" maxlength="180" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="产品图片" prop="imgSrc">
          <div style="line-height: 40px; color:#999;">(图片长宽1比1)</div>
          <div @click="importClick" class="el-upload el-upload--picture-card" v-loading="imgLoading">
            <el-image :src="form.imgSrc" v-if="form.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
            <i class="el-icon-plus" v-else></i>
            <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadFile" class="el-upload__input" :multiple="false" name="file" ref="input" type="file">
          </div>
        </el-form-item>
        <el-form-item label="支持系统" prop="system">
          <el-select v-model="form.system" placeholder="请选择" multiple style="width:100%;">
            <el-option
              v-for="item in sysList"
              :key="item.objectId"
              :label="item.title"
              :value="item.objectId">
              <div class="the-icon" v-html="item.icon"></div>
              <div class="the-title">{{ item.title }}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原价" prop="price">
          <el-input-number v-model="form.price" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="团购价" prop="groupPrice">
          <el-input-number v-model="form.groupPrice" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item align="right">
          <el-button @click="submitForm(-1)">下架暂存</el-button>
          <el-button type="primary" @click="submitForm(0)">上架</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      tableData: [],
      loading: false,

      visible: false,
      dialogTitle: '',
      dialogLoading: false,
      imgLoading: false,
      isTops: 0,
      form: {},
      rules: {
        title: [{required: true, message: '请输入', trigger: 'blur'}],
        desc: [{required: true, message: '请输入', trigger: 'blur'}],
        imgSrc: [{required: true, message: '请上传图片', trigger: 'blur'}],
        system: [{required: true, message: '请选择支持系统', trigger: 'blur'}],
        price: [{required: true, message: '请填写原价', trigger: 'blur'}],
      },
      sysList: [],
    }
  },
  activated() {
    this.getlist();
    this.getSystemList();
  },
  methods: {
    getlist() {
      this.loading = true;
      let productQuery = this.$Bmob.Query('product');
      if (this.searchText != '') {
        productQuery.equalTo('title', '===', this.searchText);
      }
      productQuery.find().then((res) => {
        this.loading = false;
        this.tableData = res;
      });
    },
    setTop(id, boolean) {
      const query = this.$Bmob.Query('product');
      query.set('id', id); //需要修改的objectId
      query.set('recommend', boolean);
      query.save().then(() => {
        this.getlist();
        this.getIsTop();
      });
    },
    getIsTop() {
      var query = this.$Bmob.Query('product');
      query.equalTo('recommend', '==', true);
      query.count().then((count) => {
        this.isTops = count;
      });
    },
    setSell(id, status) {
      const query = this.$Bmob.Query('product');
      query.set('id', id); //需要修改的objectId
      query.set('status', status);
      query.save().then(() => {
        this.getlist();
      });
    },
    getSystemList() {
      let sysQuery = this.$Bmob.Query('support_sys');
      sysQuery.find().then((res) => {
        this.sysList = res;
      });
    },
    edit(type, id) {
      this.visible = true;
      this.dialogTitle = type;

      switch (type) {
        case '新建':
          console.log(type);
          this.$router.push('/product/item');
          break;
        case '编辑':
          console.log(type, id);
          // this.getInfo(id);
          this.$router.push({
            path: '/product/item',
            query: {
              id,
            },
          });

          break;
        default:
          break;
      }
    },
    // getInfo(id) {
    //   this.dialogLoading = true;
    //   var query = this.$Bmob.Query('product');
    //   query.get(id).then((data) => {
    //     this.dialogLoading = false;
    //     this.form = {
    //       objectId: data.objectId ? data.objectId : '',
    //       title: data.title,
    //       desc: data.desc,
    //       imgSrc: data.imgSrc,
    //       price: data.price,
    //       system: data.system,
    //       groupPrice: data.groupPrice,
    //       status: data.status,
    //       notDelete: data.notDelete,
    //     }
    //   });
    // },
    // importClick() {
    //   this.imgLoading = false;
    //   this.$refs.input.value = null;
    //   this.$refs.input.click();
    // },
    // uploadFile(e) {
    //   if (e.target.files) {
    //     var localFile  = e.target.files[0];
    //     if (e.target.files[0].size > 5*1024*100) {
    //       this.$message.warning(`当前文件有${parseInt(e.target.files[0].size / 1024)}kb,上传文件不得超过500kb`);
    //       return false;
    //     }
    //     this.imgLoading = true;
    //     var file = this.$Bmob.File(localFile.name, localFile);
    //     file.save().then((file) => {
    //       this.imgLoading = false;
    //       this.form.imgSrc = file[0].url;
    //       // that.form.img = file;
    //     }, () => {
    //       this.imgLoading = false;
    //       // console.error(error);
    //       // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
    //     });
    //   }
    // },
    del(id) {
      this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var product = this.$Bmob.Query('product');
        product.set('id', id);
        product.set('notDelete', false);
        product.save().then(() => {
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
    replace(id) {
      this.$confirm('此操作将恢复该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var query = this.$Bmob.Query('product');
        query.set('id', id);
        query.set('notDelete', true);
        query.save().then(() => {
          this.$message.success('恢复成功！');
          this.getlist();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // submitForm(status) {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       this.dialogLoading = true;
    //       const query = this.$Bmob.Query('product');
    //       if (this.form.objectId) {
    //         query.set('id', this.form.objectId)
    //       }

    //       if(this.form.title) {
    //         query.set('title', this.form.title);
    //       }

    //       if(this.form.desc) {
    //         query.set('desc', this.form.desc);
    //       }

    //       if(this.form.imgSrc) {
    //         query.set('imgSrc', this.form.imgSrc);
    //       }
          
    //       if(this.form.system) {
    //         query.set('system', this.form.system);
    //       }

    //       if(this.form.price) {
    //         query.set('price', this.form.price );
    //       }

    //       if (this.form.groupPrice) {
    //         query.set('groupPrice', this.form.groupPrice);
    //       }

    //       query.set('notDelete', true);
    //       query.set('status', Number(status));
    //       query.set('recommend', false);


    //       query.save().then(() => {
    //         this.dialogLoading = false;
    //         this.visible = false;
    //         this.$message.success('提交成功！');
    //       }),(error) => {
    //         console.log(error);
    //         this.dialogLoading = false;
    //         this.visible = false;
    //       };
    //     }
    //   });
    // },
    // close() {
    //   // this.$refs.form.resetFields();
    //   this.form = {};
    // },
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

    .form {
      width: 100%;
      max-width: 900px;

      /deep/ .el-form-item__content{
        line-height: normal;
        /deep/.ql-editor{
          height: 600px;
        }
      }
    }
  }

  .el-select-dropdown__item {
    display: flex;
    height: 36px;
    align-items: center;
    .the-icon {
      display: inline-flex;
      align-items: center;
      /deep/ .icon {
        width: 18px;
        height: 18px;
        opacity: 0.5;
      }
    }
    .the-title {
      flex: 1;
      padding-left: 10px;
      font-size: 13px;
      box-sizing: border-box;
      color: #666;
    }
  }
</style>
