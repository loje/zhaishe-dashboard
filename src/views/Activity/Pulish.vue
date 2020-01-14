<template>
  <div class="pulish-page" id="pulish">
    <el-form :model="form" label-position="right" label-width="150px" :rules="rules" class="form" ref="form" v-loading="pulishLoading">
      <el-form-item label="活动标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题，最多10字"></el-input>
      </el-form-item>
      <el-form-item label="活动描述" prop="desc">
        <el-input v-model="form.desc" type="textarea" rows="3" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="活动形式" prop="mode">
        <el-select v-model="form.mode" placeholder="请选择活动形式">
          <el-option v-for="(item, $index) in modeList" :key="$index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动类型" prop="sort">
        <el-select v-model="form.sort" placeholder="请选择活动类型">
          <el-option v-for="(item, $index) in sortList" :key="$index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动图片" prop="imgSrc">
        <div style="line-height: 40px; color:#999;">(图片长宽1比1)</div>
        <div @click="importClick" class="el-upload el-upload--picture-card" v-loading="imgLoading">
          <el-image :src="form.imgSrc" v-if="form.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
          <i class="el-icon-plus" v-else></i>
          <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadFile" class="el-upload__input" :multiple="false" name="file" ref="input" type="file">
        </div>
      </el-form-item>
      <el-form-item label="活动时间" prop="time">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="早鸟票(元)" prop="birdPrice">
        <el-input-number v-model="form.birdPrice" placeholder="免费" controls-position="right" :min="0.00"></el-input-number>
      </el-form-item>
      <el-form-item label="正常票(元)" prop="fee">
        <el-input-number v-model="form.fee" placeholder="免费" controls-position="right" :min="0.00"></el-input-number>
      </el-form-item>
      <el-form-item label="活动人数" prop="number">
        <el-input-number v-model="form.number" placeholder="不限" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="活动地点" prop="address">
        <el-input v-model="form.address" placeholder="地点不限"></el-input>
      </el-form-item>
      <el-form-item label="会后笔记" prop="note">
        <el-input v-model="form.note" placeholder="请填写笔记链接"></el-input>
      </el-form-item>
      <el-form-item label="活动详情" prop="content">

        <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadImgFile" class="el-upload__input" :multiple="false" name="file" ref="imgInput" type="file">

        <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)" style="width: 100%;"></quill-editor>
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="submitForm('0')">设为暂存</el-button>
        <el-button type="primary" @click="submitForm('1')">发布</el-button>
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

      form: {
        fee: 0,
      },
      rules: {
        title: [{required: true, message: '请输入', trigger: 'blur'}],
        desc: [{required: true, message: '请输入', trigger: 'blur'}],
        mode: [{required: true, message: '请输入', trigger: 'blur'}],
        sort: [{required: true, message: '请输入', trigger: 'blur'}],
        imgSrc: [{required: true, message: '请上传图片', trigger: 'blur'}],
        // address: [{required: true, message: '请输入活动地址', trigger: 'blur'}],
        content: [{required: true, message: '请输入', trigger: 'blur'}],
      },
      imgLoading: false,

      pulishLoading: false,
      modes: [],
      modeList: [
        {
          label: '线下活动',
          value: 1,
        },
        {
          label: '线上直播',
          value: 2,
        },
      ],
      sorts: [],
      sortList: [
        {
          label: '宅设主办',
          value: 1,
        },
        {
          label: '推荐活动',
          value: 2,
        },
        {
          label: '合作活动',
          value: 3,
        },
        {
          label: '探讨会',
          value: 4,
        },
      ],
    }
  },
  components: {
    quillEditor
  },
  mounted() {
    if (this.$route.query.id) {
      this.getInfo();
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

    getInfo() {
      this.pulishLoading = true;
      var query = this.$Bmob.Query('activity');
      query.get(this.$route.query.id).then((data) => {
        for (let key in data.startTime) {
          if (key === 'iso') {
            this.form.startTime = data.startTime[key];
          }
        }
        for (let key in data.endTime) {
          if (key === 'iso') {
            this.form.endTime = data.endTime[key];
          }
        }
        this.pulishLoading = false;
        this.form = {
          title: data.title,
          desc: data.desc,
          imgSrc: data.imgSrc,
          mode: this.modeList[data.mode - 1].value,
          sort: this.sortList[data.sort - 1].value,
          time: [this.form.startTime, this.form.endTime],
          birdPrice: data.birdPrice,
          fee: data.fee,
          note: data.note,
          number: data.number,
          address: data.address,
          content: data.content,
        }
      });
    },

    submitForm(status) {
      const that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.pulishLoading = true;
          if (!that.$route.query.id) {
            const query = that.$Bmob.Query('activity');
            if(that.form.title) {
              query.set('title', that.form.title);
            }

            if(that.form.desc) {
              query.set('desc', that.form.desc);
            }

            if(that.form.mode) {
              query.set('mode', that.modeList[that.form.mode - 1].value);
            }

            if(that.form.mode) {
              query.set('sort', that.sortList[that.form.sort - 1].value);
            }

            if(that.form.imgSrc) {
              query.set('imgSrc', that.form.imgSrc);
            }
            
            if(that.form.time && that.form.time[0]) {
              query.set('startTime', {"__type":"Date", "iso":that.form.time[0]});

            }
            if(that.form.time && that.form.time[1]) {
              query.set('endTime', {"__type":"Date", "iso":that.form.time[1]});
            }

            if(that.form.birdPrice) {
              query.set('birdPrice', that.form.birdPrice );
            }

            if(that.form.fee) {
              query.set('fee', that.form.fee );
            }

            if (that.form.number) {
              query.set('number', that.form.number);
            }

            if (that.form.address) {
              query.set('address', that.form.address);
            }

            if (that.form.note) {
              query.set('note', that.form.note);
            }

            if (that.form.content) {
              query.set('content', that.form.content);
            }

            query.set('notDelete', true);
            query.set('status', Number(status));

            query.save().then(() => {
              that.pulishLoading = false;
              that.$message.success('添加成功！');
              that.$router.push('/activity');
            }),(error) => {
              console.log(error);
              that.pulishLoading = false;
            };
          } else {
            const query = that.$Bmob.Query('activity');
            query.set('id', that.$route.query.id)
            if(that.form.title) {
              query.set('title', that.form.title);
            }

            if(that.form.desc) {
              query.set('desc', that.form.desc);
            }

            if(that.form.mode) {
              query.set('mode', that.modeList[that.form.mode - 1].value);
            }

            if(that.form.mode) {
              query.set('sort', that.sortList[that.form.sort - 1].value);
            }

            if(that.form.imgSrc) {
              query.set('imgSrc', that.form.imgSrc);
            }
            
            if(that.form.time && that.form.time[0]) {
              query.set('startTime', {"__type":"Date", "iso":that.form.time[0]});

            }
            if(that.form.time && that.form.time[1]) {
              query.set('endTime', {"__type":"Date", "iso":that.form.time[1]});
            }

            if(that.form.birdPrice) {
              query.set('birdPrice', that.form.birdPrice );
            }

            if(that.form.fee) {
              query.set('fee', that.form.fee );
            }

            if (that.form.number) {
              query.set('number', that.form.number);
            }

            if (that.form.address) {
              query.set('address', that.form.address);
            }

            if (that.form.note) {
              query.set('note', that.form.note);
            }

            if (that.form.address) {
              query.set('content', that.form.content);
            }

            query.set('notDelete', true);
            query.set('status', Number(status));
            query.save().then(() => {
              that.pulishLoading = false;
              that.$message.success('编辑成功！');
              that.$router.push('/activity');
            });
          }
        } else {
          return false;
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
  },
};
</script>

<style lang="scss" scoped>
  .pulish-page {
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
</style>
