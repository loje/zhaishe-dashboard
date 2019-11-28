<template>
  <div class="pulish-page" v-loading="pulishLoading" id="pulish">
    <el-form :model="form" label-position="top" label-width="150px"  class="form" ref="form">
      <el-form-item label="活动标题">
        <el-input v-model="form.title" placeholder="请输入标题，最多10字"></el-input>
      </el-form-item>
      <el-form-item label="活动描述">
        <el-input v-model="form.desc" type="textarea" rows="3" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-select v-model="form.mode" placeholder="请选择活动形式">
          <el-option v-for="(item, $index) in modeList" :key="$index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动类型">
        <el-select v-model="form.sort" placeholder="请选择活动类型">
          <el-option v-for="(item, $index) in sortList" :key="$index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动图片(123px * 123px)">
        <div @click="importClick" class="el-upload el-upload--picture-card" v-loading="imgLoading">
          <el-image :src="form.imgSrc" v-if="form.img" fit="contain" class="img" style="width: 100%; height: 100%;"></el-image>
          <i class="el-icon-plus" v-else></i>
          <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadFile" class="el-upload__input" :multiple="false" name="file" ref="input" type="file">
        </div>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动费用">
        <el-input-number v-model="form.fee" placeholder="请输入" controls-position="right" :min="0.01"></el-input-number>
      </el-form-item>
      <el-form-item label="活动人数">
        <el-input-number v-model="form.number" controls-position="right" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="活动地点">
        <el-input v-model="form.address" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="活动详情（插入图片即可）">
        <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="submitForm('0')">保存</el-button>
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
      form: {},
      editorOption: {},
      imgLoading: false,

      dialogVisible: false,
      dialogImageUrl: '',

      pulishLoading: false,
      modes: [],
      modeList: [],
      sorts: [],
      sortList: [],
    }
  },
  components: {
    quillEditor
  },
  mounted() {
    this.getModeList();
    this.getSortList();

    if (this.$route.query.cid) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      const that = this;
      var query = new this.$AV.Query('activity');
      var img_query = new this.$AV.Query('_File');

      var mode_query = new this.$AV.Query('activity_mode');
      var sort_query = new this.$AV.Query('activity_sort');

      query.get(that.$route.query.cid).then(function (data) {
        mode_query.get(data.get('mode').id).then((mode) => {
          for (let i = 0; i < that.modeList.length; i += 1) {
            if (that.modeList[i].label === mode.get('mode')) {
              that.form = {
                ...that.form,
                mode: i,
              };
            }
          }
        });
        sort_query.get(data.get('sort').id).then((sort) => {
          for (let i = 0; i < that.sortList.length; i += 1) {
            if (that.sortList[i].label === sort.get('sortName')) {
              that.form = {
                ...that.form,
                sort: i,
              };
            }
          }
        });
        img_query.get(data.get('img').id).then((d) => {
          // mode_query.get(data.get('mode').id).then((mode) => {
            // sort_query.get(data.get('sort').id).then((sort) => {
          that.form = {
            ...that.form,
            title: data.get('title'),
            desc: data.get('desc'),
            img: data.get('img'),
            imgSrc: d.get('url'),
            // mode: that.modes[that.form.mode],
            // sort: that.sorts[that.form.sort],
            time: [ data.get('startTime'), data.get('endTime') ],
            fee: data.get('fee'),
            number: data.get('number'),
            address: data.get('address'),
            content: data.get('content'),
          }
            // });
          // });
        });
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
          if (!that.$route.query.cid) {
            let Activity = this.$AV.Object.extend('activity');
            let activity = new Activity();
            activity.set({
              ...that.form,
              mode: that.modes[that.form.mode],
              sort: that.sorts[that.form.sort],
              status: Number(status),
              startTime: that.form.time && that.form.time[0] ? that.form.time[0] : undefined,
              endTime: that.form.time && that.form.time[1] ? that.form.time[1] : undefined,
              time: undefined,
              imgSrc: undefined,
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
            let activity = this.$AV.Object.createWithoutData('activity', that.$route.query.cid);
            activity.set({
              ...that.form,
              mode: that.modes[that.form.mode],
              sort: that.sorts[that.form.sort],
              status: Number(status),
              startTime: that.form.time[0],
              endTime: that.form.time[1],
              time: undefined,
              imgSrc: undefined,
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
          console.log(file.id);
          that.imgLoading = false;
          that.form.imgSrc = file.attributes.url;
          that.form.img = file;
        }, function (error) {
          that.imgLoading = false;
          console.error(error);
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
      width: 770px;
      /deep/ .el-form-item__content{
        line-height: normal;
        /deep/.ql-editor{
          height: 300px;
        }
      }
    }
  }
</style>
