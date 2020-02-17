<template>
  <div class="activity-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/activity/pulish')">新建活动</el-button>

        <div class="input-group">
          <el-input type="text" placeholder="请输入内容" v-model="searchText" clearable>
            <el-button slot="append" icon="el-icon-search" @click="dataSearch" class="el-button--primary"></el-button>
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
          label="活动标题"
          prop="title"
          min-width="250">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover">
              <el-image :src="scope.row.img" style="width: 150px;" fit="contain"></el-image>
              <template slot="reference">
                <div class="title">{{scope.row.title}}</div>
                <!-- <div class="desc" style="font-size:12px;color:#999;">{{scope.row.desc}}</div> -->
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="报名人数"
          prop="count"
          align="center"
          width="200">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.count/scope.row.num * 100" :show-text="false" :stroke-width="12" style="display: inline-block; width: 80px;"></el-progress>
            <span style="margin-left:10px;font-size: 12px;">{{scope.row.count}} / {{scope.row.num}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="pv"
          label="浏览量">
        </el-table-column> -->
        <el-table-column
          align="center"
          label="活动时间"
          min-width="200">
          <template slot-scope="scope">
            <div style="font-size:12px;">开始时间：{{scope.row.startTime}}</div>
            <div style="font-size:12px;">结束时间：{{scope.row.endTime}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <div class="state" v-if="scope.row.status === 0">
              <span class="icon" style="background-color: #999;"></span>
              <span class="text">暂存中</span>
            </div>
            <div class="state" v-else-if="scope.row.status === 1">
              <span class="icon" style="background-color: #FFCB2B;"></span>
              <span class="text">可报名</span>
            </div>
            <div class="state" v-else-if="scope.row.status === 2">
              <span class="icon" style="background-color: #999;"></span>
              <span class="text">报名结束</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建时间" prop="createdAt" min-width="200"></el-table-column> -->
        <!-- <el-table-column label="更新时间" prop="updatedAt" min-width="200"></el-table-column> -->
        <el-table-column
          prop="toDo"
          width="550"
          label="操作">
          <template slot-scope="scope">
            <el-button type="info" size="small" icon="el-icon-s-flag" v-if="scope.row.isTop === true" @click="setTop(scope.row.id, false)">取消置顶</el-button>
            <el-button :type="scope.row.status === 1 ? 'primary' : 'info'" size="small" icon="el-icon-s-flag" v-else @click="setTop(scope.row.id, true)">首页置顶</el-button>

            <el-button :type="scope.row.status === 1 ? 'primary' : 'info'" size="small" icon="el-icon-finished" @click="audit(scope.row.id, scope.row.title)">报名人</el-button>

            <el-button size="small" @click="$router.push({path: '/activity/channel', query: {id: scope.row.id}})">渠道</el-button>

            <!-- <el-button :type="scope.row.status === 1 ? 'primary' : 'info'" size="small" icon="el-icon-finished" @click="note(scope.row.id, scope.row.title)">会后笔记</el-button> -->

            <el-button-group style="margin-left: 15px;">
            <el-button size="small" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="del(scope.row.id)" :disabled="scope.row.count > 0">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- <el-dialog :title="dialogTitle + ' - 会后笔记'"
      :visible.sync="dialogVisible"
      v-loading="dialogLoading"
      width="900px">
      <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadImgFile" class="el-upload__input" :multiple="false" name="file" ref="imgInput" type="file">

      <quill-editor v-model="dialogContent" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)" style="width: 100%;"></quill-editor>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confilm">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// const toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//   [{'header': 1}, {'header': 2}],               // custom button values
//   [{'list': 'ordered'}, {'list': 'bullet'}],
//   [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
//   [{'direction': 'rtl'}],                         // text direction
//   [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
//   [{'header': [1, 2, 3, 4, 5, 6, false]}],
//   [{'color': []}, {'background': []}],          // dropdown with defaults from theme
//   [{'font': []}],
//   [{'align': []}],
//   ['link', 'image'],
//   ['clean']
// ]

// import {
//   quillEditor
// } from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

export default {
  data() {
    return {
      // editorOption: {
      //   placeholder: '',
      //   theme: 'snow',  // or 'bubble'
      //   modules: {
      //     toolbar: {
      //       container: toolbarOptions,
      //       handlers: {
      //         'image': (value) => {
      //           if (value) {
      //             // 触发input框选择图片文件
      //             // document.querySelector('.avatar-uploader input').click()
      //             this.$refs.imgInput.value = null;
      //             this.$refs.imgInput.click();
      //           } else {
      //             this.quill.format('image', false);
      //           }
      //         }
      //       }
      //     }
      //   }
      // },
      // serverUrl: '/manager/common/imgUpload',  // 这里写你要上传的图片服务器地址


      searchText: '',

      pageSize: 10,
      skip: 0,
      tableData: [],
      current: 1,
      total: 0,
      loading: false,

      dialogVisible: false,
      dialogContent: '',
      dialogId: '',
      dialogTitle: '',
      dialogLoading: false,

      isTops: 0,
      
    }
  },
  // components: {
  //   quillEditor
  // },
  activated() {
    this.getActivityList();
    this.getActivityCount();
    this.getIsTop();
  },
  methods: {
    onEditorChange({editor, html, text}) {//内容改变事件
      console.log("---内容改变事件---")
      this.dialogContent = html
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

    setTop(id, boolean) {
      if(boolean === true) {
        if (this.isTops < 4 ) {
          const query = this.$Bmob.Query('activity');
          query.set('id', id); //需要修改的objectId
          query.set('isTop', boolean);
          query.save().then(() => {
            this.getActivityList();
            this.getIsTop();
          });
        } else {
          this.$message.error('已置顶满四个');
        }
      } else {
        const query = this.$Bmob.Query('activity');
        query.set('id', id); //需要修改的objectId
        query.set('isTop', boolean);
        query.save().then(() => {
          this.getActivityList();
          this.getIsTop();
        });
      }
    },
    dataSearch() {
      this.getActivityList();
    },
    getIsTop() {
      var query = this.$Bmob.Query('activity');
      query.equalTo('isTop', '==', true);
      query.count().then((count) => {
        this.isTops = count;
      });
    },
    getActivityList() {
      this.loading = true;
      let dataList = [];
      let apList = [];

      var apQuery = this.$Bmob.Query('activity_person');
      apQuery.find().then((res) => {
        apList = res;
      });

      var query = this.$Bmob.Query('activity');
      const skip = this.pageSize * (this.current - 1);
      query.order('-endTime');
      query.equalTo('notDelete', '==', true);
      if (this.searchText !== '') {
        query.equalTo('title', '==', this.searchText);
      }
      query.limit(this.pageSize);
      query.skip(skip);
      query.find().then((data) => {
        this.loading = false;
        for (let i = 0; i < data.length; i += 1) {
          let count = 0;
          for (let j = 0; j < apList.length; j += 1) {
            if (data[i].objectId === apList[j].activity.objectId) {
              count += 1;
            }
          }
          for (let key in data[i].startTime) {
            if (key === 'iso') {
              data[i].startTime = data[i].startTime[key];
            }
          }
          for (let key in data[i].endTime) {
            if (key === 'iso') {
              data[i].endTime = data[i].endTime[key];
            }
          }
          for (let key in data[i].createdAt) {
            if (key === 'iso') {
              data[i].createdAt = data[i].createdAt[key];
            }
          }
          for (let key in data[i].updatedAt) {
            if (key === 'iso') {
              data[i].updatedAt = data[i].updatedAt[key];
            }
          }
          dataList.push({
            id: data[i].objectId,
            img: data[i].imgSrc,
            title: data[i].title,
            desc: data[i].desc,
            count,
            num: data[i].number,
            pv: data[i].pv,
            startTime: this.$moment(data[i].startTime).format('YYYY-MM-DD HH:mm'),
            endTime: this.$moment(data[i].endTime).format('YYYY-MM-DD HH:mm'),
            status: data[i].status,
            isTop: data[i].isTop,
            createdAt: this.$moment(data[i].createdAt).format('YYYY-MM-DD HH:mm'),
            updatedAt: this.$moment(data[i].updatedAt).format('YYYY-MM-DD HH:mm'),
          });
        }
        this.tableData = dataList;
      });
    },
    getActivityCount() {
      var query = this.$Bmob.Query('activity');
      query.equalTo('notDelete', '==', true);
      query.count().then((count) => {
        this.total = count;
      });
    },
    handleSizeChange(page) {
      this.current = 1;
      this.pageSize = page;
      this.getActivityList();
    },
    handleCurrentChange(current) {
      this.current = current;
      this.getActivityList();
    },
    edit(id) {
      this.$router.push({
        path: '/activity/pulish',
        query: { id },
      })
    },
    del(id) {
      this.$confirm('此操作将删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var activity = this.$Bmob.Query('activity');
        activity.set('id', id);
        activity.set('notDelete', false);
        activity.save().then(() => {
          this.$message.success('删除成功！');
          this.getActivityList();
          this.getActivityCount();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    audit(id, title) {
      this.$router.push({
        path: '/activity/audit',
        query: {
          id,
          title
        },
      });
    },
    // note(id, title) {
    //   this.dialogTitle = title;
    //   this.dialogId = id;
    //   this.dialogVisible = true;

    //   this.dialogLoading = true;
    //   var query = this.$Bmob.Query('activity');
    //   query.get(id).then((data) => {
    //     this.dialogLoading = false;
    //     this.dialogContent = data.note; 
    //   });
    // },
    // confilm() {
    //   this.dialogLoading = true;
    //   let activity = this.$Bmob.Query('activity');
    //   activity.set('id', this.dialogId);
    //   activity.set('note', this.dialogContent);
    //   activity.save().then(() => {
    //     this.dialogLoading = false;
    //     this.dialogTitle = '';
    //     this.dialogId = '';
    //     this.dialogVisible = false;
    //     this.$message.success('编辑成功！');
    //   });
    // },
  },
}
</script>

<style lang="scss" scope>
  .state {
    .icon {
      display: inline-block;
      margin-right: 10px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .activity-layer {
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

    /deep/.ql-editor{
      height: 600px;
    }
  }
</style>
