<template>
  <div class="pulish-page">
    <el-form :model="form" label-position="top" label-width="150px"  class="form" ref="form">
      <el-form-item label="活动标题">
        <el-input v-model="form.title" placeholder="请输入标题，最多10字"></el-input>
      </el-form-item>
      <el-form-item label="活动描述">
        <el-input v-model="form.desc" type="textarea" rows="3" placeholder="请输入"></el-input>
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
    }
  },
  components: {
    quillEditor
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      const that = this;
      var query = new this.$AV.Query('activity');
      query.get(that.$route.query.cid).then(function (data) {
        that.form = {
          title: data.get('title'),
          desc: data.get('desc'),
          time: [ data.get('startTime'), data.get('endTime') ],
          fee: data.get('fee'),
          number: data.get('number'),
          address: data.get('address'),
          content: data.get('content'),
        };
      });
    },
    submitForm(status) {
      const that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!that.$route.query.cid) {
            let Activity = this.$AV.Object.extend('activity');
            let activity = new Activity();
            activity.set({
              ...that.form,
              status: Number(status),
              startTime: that.form.time[0],
              endTime: that.form.time[1],
              time: undefined,
            });
            activity.save().then(function () {
              that.$message.success('添加成功！');
              that.$router.push('/activity');
              // 成功保存之后，执行其他逻辑
            }, function () {
              // 异常处理
            });
          } else {
            let activity = this.$AV.Object.createWithoutData('activity', that.$route.query.cid);
            activity.set({
              ...that.form,
              status: Number(status),
              startTime: that.form.time[0],
              endTime: that.form.time[1],
              time: undefined,
            });
            activity.save().then(function () {
              that.$message.success('编辑成功！');
              that.$router.push('/activity');
              // 成功保存之后，执行其他逻辑
            }, function () {
              // 异常处理
            });
          }
          
        } else {
          return false;
        }
      });
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
