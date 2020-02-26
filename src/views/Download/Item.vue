<template>
  <div class="download-page">
    <el-form :model="form" label-position="right" label-width="100px" :rules="rules" class="form" ref="form" v-loading="loading">
      <el-form-item label="资源标题" prop="title">
        <el-input type="text" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="上传人" prop="author">
        <el-input type="text" v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="微信" prop="wechat">
        <el-input type="text" v-model="form.wechat"></el-input>
      </el-form-item>
      <!-- <el-form-item label="资源图片" prop="imgSrc">
        <div style="line-height: 40px; color:#999;">(图片长宽2比1)</div>
        <div @click="importClick" class="el-upload el-upload--picture-card" v-loading="imgLoading">
          <el-image :src="form.imgSrc" v-if="form.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
          <i class="el-icon-plus" v-else></i>
          <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadFile" class="el-upload__input" :multiple="false" name="file" ref="input" type="file">
        </div>
      </el-form-item> -->
      <el-form-item label="资源分类" prop="sort">
        <el-select v-model="form.sort">
          <el-option v-for="(item, $index) in sortList" :key="$index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type">
          <el-option v-for="(item, $index) in typeList" :key="$index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下载链接" prop="link">
        <el-input type="text" v-model="form.link" placeholder="请输入链接"></el-input>
      </el-form-item>
      <el-form-item label="提取码" prop="code">
        <el-input type="text" v-model="form.code" placeholder="请输入提取码"></el-input>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      rules: {
        title: [{required: true, message: '请输入资源标题', trigger: 'blur'}],
        // imgSrc: [{required: true, message: '请上传图片', trigger: 'blur'}],
        sort: [{required: true, message: '请选择资源分类', trigger: 'blur'}],
        type: [{required: true, message: '请选择类型', trigger: 'blur'}],
        link: [{required: true, message: '请输入链接', trigger: 'blur'}],
        // code: [{required: true, message: '请输入提取码', trigger: 'blur'}],
      },
      loading: false,
      imgLoading: false,
      sortList: [],
      typeList: [
        {
          label: 'banner',
          value: 1,
        },
        {
          label: 'H5',
          value: 2,
        },
        {
          label: 'Web',
          value: 3,
        },
        {
          label: 'App',
          value: 4,
        },
        {
          label: 'Logo',
          value: 5,
        },
        {
          label: '其他',
          value: 6,
        },
      ],
    }
  },
  mounted() {
    this.getSort();
    if (this.$route.query.id) {
      this.getInfo(this.$route.query.id);
    }
  },
  methods: {
    getInfo(id) {
      this.loading = true;
      var query = this.$Bmob.Query('download');
      query.get(id).then((data) => {
        this.loading = false;
        this.form = {
          objectId: data.objectId ? data.objectId : '',
          title: data.title,
          author: data.author,
          // imgSrc: data.imgSrc,
          sort: data.sort,
          link: data.link,
          code: data.code,
        }
      });
    },
    getSort() {
      var query = this.$Bmob.Query('download_sort');
      let arr = [];
      query.find().then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          arr.push({
            id: res[i].objectId,
            name: res[i].name,
          });
        }
        this.sortList = arr;
      });
    },
    importClick() {
      this.imgLoading = false;
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    // uploadFile(e) {
    //   if (e.target.files) {
    //     var localFile  = e.target.files[0];
    //     if (e.target.files[0].size > 5*1024*100) {
    //       this.$message.warning(`当前文件有${parseInt(e.target.files[0].size / 1024)}kb,上传文件不得超过500kb`);
    //       return false;
    //     }
    //     this.imgLoading = true;
    //     var file = this.$Bmob.File(localFile.name, localFile);
    //     file.save().then((res) => {
    //       this.imgLoading = false;
    //       this.form.imgSrc = res[0].url;
    //     }, () => {
    //       this.imgLoading = false;
    //       // console.error(error);
    //       // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
    //     });
    //   }
    // },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const query = this.$Bmob.Query('download');
          if (this.form.objectId) {
            query.set('id', this.form.objectId)
          }
          if(this.form.title) {
            query.set('title', this.form.title);
          }
          if(this.form.author) {
            query.set('author', this.form.author);
          }
          if(this.form.wechat) {
            query.set('wechat', this.form.wechat);
          }
          if(this.form.imgSrc) {
            query.set('imgSrc', this.form.imgSrc);
          }
          if(this.form.sort) {
            query.set('sort', this.form.sort);
          }
          if(this.form.type) {
            query.set('type', this.form.type);
          }
          if(this.form.link) {
            query.set('link', this.form.link);
          }
          if(this.form.code) {
            query.set('code', this.form.code);
          }
          query.save().then(() => {
            this.loading = false;
            this.$message.success('提交成功！');
            this.$router.back(-1);
          }),(error) => {
            console.log(error);
            this.loading = false;
          };
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .download-page {
    padding: 50px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    box-sizing: border-box;
    .form {
      width: 100%;
      max-width: 900px;
    }
  }
</style>