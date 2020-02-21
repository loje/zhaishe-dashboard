<template>
  <div class="product-page">
    <el-form :model="form" label-position="right" label-width="100px" :rules="rules" class="form" ref="form" v-loading="loading">
      <el-form-item label="产品标题" prop="title">
        <el-input type="text" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="产品介绍" prop="desc">
        <el-input type="textarea" v-model="form.desc" rows="3" maxlength="180" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="产品小图" prop="imgSrc">
        <div style="line-height: 40px; color:#999;">(图片长宽1比1)</div>
        <div @click="importClick" class="el-upload el-upload--picture-card" v-loading="imgLoading">
          <el-image :src="form.imgSrc" v-if="form.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
          <i class="el-icon-plus" v-else></i>
          <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadFile" class="el-upload__input" :multiple="false" name="file" ref="input" type="file">
        </div>
      </el-form-item>
      <el-form-item label="产品列表图" prop="imgListSrc">
        <div style="line-height: 40px; color:#999;">(图片长宽190px * 110px)</div>
        <div @click="importListClick" class="el-upload el-upload--picture-card" style="width: 190px; height: 110px;line-height: 110px;" v-loading="imgListLoading">
          <el-image :src="form.imgListSrc" v-if="form.imgListSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
          <i class="el-icon-plus" v-else></i>
          <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadListFile" class="el-upload__input" :multiple="false" name="file" ref="inputList" type="file">
        </div>
      </el-form-item>
      <!-- <el-form-item label="支持系统" prop="system">
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
      </el-form-item> -->
      <el-form-item label="原价" prop="price">
        <el-input-number v-model="form.price" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="原价库存" prop="inventory">
        <el-input-number v-model="form.inventory" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="团购价" prop="groupPrice">
        <el-input-number v-model="form.groupPrice" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="团购库存" prop="groupInventory">
        <el-input-number v-model="form.groupInventory" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="官网地址" prop="website">
        <el-input type="text" v-model="form.website" placeholder="请填写带有http://或https://前缀的地址"></el-input>
      </el-form-item>
      <el-form-item label="热门软件" prop="isHot">
        <!-- <el-input type="text" v-model="form.isHot" placeholder="请填写带有http://或https://前缀的地址"></el-input> -->
        <el-select v-model="form.isHot" placeholder="请选择">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品详情" prop="content">
        <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadImgFile" class="el-upload__input" :multiple="false" name="file" ref="imgInput" type="file">

        <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)" style="width: 100%;"></quill-editor>
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="submitForm(-1)">下架暂存</el-button>
        <el-button type="primary" @click="submitForm(0)">上架</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction
  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['link', 'image'],
  ['clean']
]

import {
  quillEditor
} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  data() {
    return {
      content: null,
      editorOption: {
        placeholder: '',
        theme: 'snow',  // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': (value) => {
                if (value) {
                  // 触发input框选择图片文件
                  // document.querySelector('.avatar-uploader input').click()
                  this.$refs.imgInput.value = null;
                  this.$refs.imgInput.click();
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      serverUrl: '/manager/common/imgUpload',  // 这里写你要上传的图片服务器地址

      loading: false,
      imgLoading: false,
      imgListLoading: false,

      form: {
        inventory: 0,
        groupInventory: 0,
        isHot: 0,
      },
      rules: {
        title: [{required: true, message: '请输入', trigger: 'blur'}],
        desc: [{required: true, message: '请输入', trigger: 'blur'}],
        imgSrc: [{required: true, message: '请上传图片', trigger: 'blur'}],
        imgListSrc: [{required: true, message: '请上传图片', trigger: 'blur'}],
        
        // system: [{required: true, message: '请选择支持系统', trigger: 'blur'}],
        price: [{required: true, message: '请填写原价', trigger: 'blur'}],
        inventory: [{required: true, message: '请填写原价库存', trigger: 'blur'}],
        website: [{required: true, message: '请填写官网地址', trigger: 'blur'}],
        content: [{required: true, message: '请填写详情', trigger: 'blur'}],
      },
      // sysList: [],
    }
  },
  components: {
    quillEditor
  },
  mounted() {
    // this.getSystemList();
    if (this.$route.query.id) {
      this.getInfo(this.$route.query.id);
    }
  },
  methods: {
    onEditorChange({editor, html, text}) {//内容改变事件
      console.log("---内容改变事件---")
      this.content = html
      console.log(editor);
      // console.log(html);
      console.log(text);
    },
    uploadImgFile(e) {
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (e.target.files[0].size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(e.target.files[0].size / 1024)}kb，为保障页面顺畅加载，上传文件不得超过500kb`);
          return false;
        }
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          let quill = this.$refs.myQuillEditor.quill
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.url为服务器返回的图片地址
          quill.insertEmbed(length, 'image', file[0].url)
          // 调整光标到最后
          quill.setSelection(length + 1)
        }, () => {
          this.imgLoading = false;
          this.$message.error('图片插入失败');
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
      }
    },
    // getSystemList() {
    //   let sysQuery = this.$Bmob.Query('support_sys');
    //   sysQuery.find().then((res) => {
    //     this.sysList = res;
    //   });
    // },

    getInfo(id) {
      this.loading = true;
      var query = this.$Bmob.Query('product');
      query.get(id).then((data) => {
        this.loading = false;
        this.form = {
          objectId: data.objectId ? data.objectId : '',
          title: data.title,
          desc: data.desc,
          imgSrc: data.imgSrc,
          imgListSrc: data.imgListSrc,
          price: data.price,
          // system: data.system,
          inventory: data.inventory ? data.inventory : 0,
          groupPrice: data.groupPrice,
          groupInventory: data.groupInventory ? data.groupInventory : 0,
          isHot: data.isHot ? data.isHot : 0,
          content: data.content,
          status: data.status,
          website: data.website ? data.website : undefined,
          notDelete: data.notDelete,
        }
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
          this.form.imgSrc = file[0].url;
          // that.form.img = file;
        }, () => {
          this.imgLoading = false;
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
      }
    },

    importListClick() {
      this.imgListLoading = false;
      this.$refs.inputList.value = null;
      this.$refs.inputList.click();
    },
    uploadListFile(e) {
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (e.target.files[0].size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(e.target.files[0].size / 1024)}kb,上传文件不得超过500kb`);
          return false;
        }
        this.imgListLoading = true;
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          this.imgListLoading = false;
          this.form.imgListSrc = file[0].url;
          // that.form.img = file;
        }, () => {
          this.imgListLoading = false;
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
      }
    },

    submitForm(status) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const query = this.$Bmob.Query('product');
          if (this.form.objectId) {
            query.set('id', this.form.objectId)
          }

          if(this.form.title) {
            query.set('title', this.form.title);
          }

          if(this.form.desc) {
            query.set('desc', this.form.desc);
          }

          if(this.form.imgSrc) {
            query.set('imgSrc', this.form.imgSrc);
          }
          
          // if(this.form.system) {
          //   query.set('system', this.form.system);
          // }

          if (this.form.website) {
            query.set('website', this.form.website );
          }

          if(this.form.price) {
            query.set('price', this.form.price );
          }

          if(this.form.inventory) {
            query.set('inventory', this.form.inventory );
          }

          if (this.form.groupPrice) {
            query.set('groupPrice', this.form.groupPrice);
          }

          if(this.form.groupInventory) {
            query.set('groupInventory', this.form.groupInventory );
          }

          if(this.form.isHot) {
            query.set('isHot', this.form.isHot );
          }

          if (this.form.content) {
            query.set('content', this.form.content);
          }

          query.set('notDelete', true);
          query.set('status', Number(status));
          if (status === -1) {
            query.set('recommend', false);
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
    close() {
      // this.$refs.form.resetFields();
      this.form = {};
    },
  },
};
</script>

<style lang="scss" scoped>
  .product-page {
    padding: 50px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    box-sizing: border-box;
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
