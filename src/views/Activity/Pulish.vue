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
      <el-form-item label="活动费用" prop="fee">
        <el-input-number v-model="form.fee" placeholder="免费" controls-position="right" :min="0.00"></el-input-number>
      </el-form-item>
      <el-form-item label="活动人数" prop="number">
        <el-input-number v-model="form.number" placeholder="不限" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="活动地点" prop="address">
        <el-input v-model="form.address" placeholder="地点不限"></el-input>
      </el-form-item>
      <el-form-item label="活动详情" prop="content">
        <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" style="width: 100%;"></quill-editor>
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="submitForm('0')">设为暂存</el-button>
        <el-button type="primary" @click="submitForm('1')">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  quillEditor
} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


export default {
  data() {
    return {
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
      editorOption: {},
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
    // this.getModeList();
    // this.getSortList();

    if (this.$route.query.id) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      const that = this;
      that.pulishLoading = true;
      var query = new this.$AV.Query('activity');
      query.get(that.$route.query.id).then(function (data) {
        that.pulishLoading = false;
        that.form = {
          title: data.get('title'),
          desc: data.get('desc'),
          imgSrc: data.get('imgSrc'),
          mode: that.modeList[data.get('mode') - 1].value,
          sort: that.sortList[data.get('sort') - 1].value,
          time: [ data.get('startTime'), data.get('endTime') ],
          fee: data.get('fee'),
          number: data.get('number'),
          address: data.get('address'),
          content: data.get('content'),
        }
      });
    },
    getModeList() {
      const that = this;
      const list = [];
      var query = new this.$AV.Query('activity_mode');
      query.find().then(function (data) {
        for(let i = 0; i < data.length; i += 1) {
          list.push({
            label: data[i].attributes.mode,
            value: i,
          });
        }
        that.modes = data;
        that.modeList = list;
      });
    },
    getSortList() {
      const that = this;
      const list = [];
      var query = new this.$AV.Query('activity_sort');
      query.find().then(function (data) {
        for(let i = 0; i < data.length; i += 1) {
          list.push({
            label: data[i].attributes.sortName,
            value: i,
          });
        }
        that.sortList = list;
        that.sorts = data;
      });
    },
    submitForm(status) {
      const that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.pulishLoading = true;
          if (!that.$route.query.id) {
            let Activity = this.$AV.Object.extend('activity');
            let activity = new Activity();
            activity.set({
              ...that.form,
              status: Number(status),
              startTime: that.form.time && that.form.time[0] ? that.form.time[0] : undefined,
              endTime: that.form.time && that.form.time[1] ? that.form.time[1] : undefined,
              time: undefined,
              fee: that.form.fee ? that.form.fee : 0,
              number: that.form.number ? that.form.number : 0,
              address: that.form.address ? that.form.address : '',
              notDelete: true,
            });
            activity.save().then(function () {
              that.pulishLoading = false;
              that.$message.success('添加成功！');
              that.$router.push('/activity');
              // 成功保存之后，执行其他逻辑
            }, function () {
              that.pulishLoading = false;
              // 异常处理
            });
          } else {
            let activity = this.$AV.Object.createWithoutData('activity', that.$route.query.id);
            activity.set({
              ...that.form,
              status: Number(status),
              startTime: that.form.time && that.form.time[0] ? that.form.time[0] : undefined,
              endTime: that.form.time && that.form.time[1] ? that.form.time[1] : undefined,
              time: undefined,
              fee: that.form.fee ? that.form.fee : 0,
              number: that.form.number ? that.form.number : 0,
              address: that.form.address ? that.form.address : '',
            });
            activity.save().then(function () {
              that.pulishLoading = false;
              that.$message.success('编辑成功！');
              that.$router.push('/activity');
              // 成功保存之后，执行其他逻辑
            }, function () {
              that.pulishLoading = false;
              // 异常处理
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
      this.imgLoading = true;
      const that = this;
      if (e.target.files) {
        var localFile  = e.target.files[0];
        var file = new this.$AV.File(localFile.name, localFile);
        file.save().then(function (file) {
          that.imgLoading = false;
          that.form.imgSrc = file.attributes.url;
          // that.form.img = file;
        }, function () {
          that.imgLoading = false;
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
