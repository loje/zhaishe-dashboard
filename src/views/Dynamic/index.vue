<template>
  <div class="dynamic-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>动态列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="visible = true">新建动态</el-button>
      </div>
    </div>

    <div class="dynamic-list">
      <template v-for="(item, $index) in list">
        <el-card :key="$index" :body-style="{ padding: '0px' }" shadow="hover" class="the-dynamic">
          <div slot="header" class="dynamic-header">
            <div class="user">
              <el-avatar icon="el-icon-user-solid" :size="32" class="avatar"></el-avatar>
              <span class="nickname">{{item.user.nickname}}</span>
              <span class="tag-list">{{item.tags}}</span>
            </div>
            <div class="func-list">
              <div class="func">
                <i class="el-icon-edit-outline" @click="edit(item)"></i>
              </div>
              <div class="func">
                <i class="el-icon-delete" @click="del(item)"></i>
              </div>
            </div>
          </div>
          <div class="dynamic-pic">
            <el-image
              :src="item.imglist[0].imgSrc"
              :preview-src-list="item.srclist"
              class="image"
              fit="cover"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="card-body">
            <div class="title">{{item.title}}</div>
            <div class="desc">{{item.desc}}</div>
          </div>
        </el-card>
      </template>
    </div>

    <el-dialog :visible.sync="visible" width="500px" :close-on-click-modal="false" @close="closeDialog">
      <div slot="title">新建动态</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="动态标签：" prop="taglist">
          <el-tag
            :key="tag"
            v-for="tag in form.taglist"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 增加标签</el-button>
        </el-form-item>
        <el-form-item label="动态图片：" prop="imglist">
          <div style="line-height: 40px; color:#999;">(图片推荐长宽750px * 500px)</div>
          <template v-if="form.imglist && form.imglist.length > 0">
            <template v-for="(item, $index) in form.imglist">
              <div
                class="el-upload el-upload--picture-card"
                :key="$index"
                style="width:150px;height:100px;line-height:50px;"
              >
                <div class="hover">
                  <i class="el-icon-delete" @click="delimg(item.imgSrc, $index)"></i>
                </div>
                <el-image :src="item.imgSrc" fit="contain" class="img" lazy></el-image>
              </div>
            </template>
          </template>
          <div
            @click="importClick"
            class="el-upload el-upload--picture-card"
            style="width:150px;height:100px;line-height:50px;"
            v-loading="imgLoading"
          >
            <i class="el-icon-plus"></i>
            <input
              accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg"
              @change="uploadFile"
              class="el-upload__input"
              :multiple="false"
              name="file"
              ref="input"
              type="file"
            />
          </div>
        </el-form-item>
        <el-form-item label="动态标题：" prop="title">
          <el-input type="text" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="动态描述：" prop="desc">
          <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      inputVisible: false,
      inputValue: "",

      dialogImageUrl: "",
      dialogVisible: false,

      form: {
        taglist: [],
        imglist: [],
      },
      rules: {
        taglist: [
          { required: true, message: "请增加动态标签", trigger: "blur" },
        ],
        imglist: [
          { required: true, message: "请上传动态图片", trigger: "blur" },
        ],
        title: [{ required: true, message: "请填写动态标题", trigger: "blur" }],
        desc: [{ required: true, message: "请填写动态描述", trigger: "blur" }],
      },

      imgLoading: false,

      list: [],
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      const query = this.$Bmob.Query("dynamic_list");
      query.include("user");
      query.equalTo("notDelete", "==", true);
      query.find().then((res) => {
        const list = res;
        for (let i = 0; i < list.length; i += 1) {
          list[i].tags = list[i].taglist.toString().replace(/,/g, " / ");
          list[i].srclist = [];
          for (let j = 0; j < list[i].imglist.length; j += 1) {
            list[i].srclist.push(list[i].imglist[j].imgSrc);
          }
        }
        this.list = list;
      });
    },
    delimg(src, index) {
      let that = this;
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          console.log(src, index);
          // 传入string是单个文件删除，传入array是批量删除
          const delimg = that.$Bmob.File();
          delimg
            .destroy(src)
            .then((res) => {
              console.log(res);
              this.form.imglist.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log(error);
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    importClick() {
      this.imgLoading = false;
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    uploadFile(e) {
      if (e.target.files) {
        var localFile = e.target.files[0];
        if (e.target.files[0].size > 5 * 1024 * 100) {
          this.$message.warning(
            `当前文件有${parseInt(
              e.target.files[0].size / 1024
            )}kb,上传文件不得超过500kb`
          );
          return false;
        }
        this.imgLoading = true;
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then(
          (file) => {
            this.imgLoading = false;
            this.form.imglist.push({
              imgSrc: file[0].url,
            });
          },
          () => {
            this.imgLoading = false;
            // console.error(error);
            // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
          }
        );
      }
      // const that = this;
      // if (e.target.files) {
      //   let localFile  = e.target.files[0];
      //   if (localFile.size > 5*1024*100) {
      //     this.$message.warning(`当前文件有${parseInt(localFile.size / 1024)}kb,上传文件不得超过500kb`);
      //     return false;
      //   }
      //   this.imgLeftLoading = true;
      //   let file = this.$Bmob.File(localFile.name, localFile);
      //   file.save().then((file) => {
      //     var newBanner = this.$Bmob.Query('banner');
      //     newBanner.set('position', 'left');
      //     newBanner.set('imgSrc', file[0].url);
      //     newBanner.save().then((res) => {
      //       this.imgLeftLoading = false;
      //       this.bannerLeft.push({
      //         id: res.objectId,
      //         imgSrc: file[0].url,
      //       });
      //       that.$refs.leftSwiper.update();
      //     });
      //   }, function () {
      //     this.imgLeftLoading = false;
      //     // console.error(error);
      //     // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
      //   });
      //   this.getBanner();
      // }
    },
    handleClose(tag) {
      this.form.taglist.splice(this.form.taglist.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.taglist.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const dynamicQuery = this.$Bmob.Query("dynamic_list");
          if (this.form.objectId) {
            dynamicQuery.set("id", this.form.objectId);
          }

          const pointer = this.$Bmob.Pointer("_User");
          const poiID = pointer.set(
            JSON.parse(localStorage.getItem("userInfo")).userid
          );
          dynamicQuery.set("user", poiID);
          dynamicQuery.set("taglist", this.form.taglist);
          dynamicQuery.set("imglist", this.form.imglist);
          dynamicQuery.set("title", this.form.title);
          dynamicQuery.set("desc", this.form.desc);
          dynamicQuery.set("notDelete", true);

          dynamicQuery.save().then(() => {
            this.form = {};
            this.visible = false;
            this.getlist();
          });
        }
      });
    },

    edit(item) {
      this.visible = true;
      this.form = item;
    },
    del(item) {
      let that = this;
      this.$confirm("此操作将永久删除该动态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        const query = that.$Bmob.Query("dynamic_list");
        query
          .get(item.objectId)
          .then((res) => {
            res.set("notDelete", false);
            res.save().then(() => {
              that.$message.success("删除成功");
              that.getlist();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    closeDialog() {
      this.visible = false;
      this.form = {
        taglist: [],
        imglist: [],
      };
    },
  },
};
</script>
<style lang="scss" scoped>
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
  }
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.dynamic-list {
  display: flex;
  flex-wrap: wrap;
  .the-dynamic {
    margin-right: 20px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    width: 375px;
    border: none;
    border-radius: 0;
    /deep/.el-card__header {
      padding: 15px;
    }
    .dynamic-header {
      position: relative;
      width: 100%;
      .user {
        display: flex;
        align-items: center;
        .nickname {
          margin-left: 10px;
          font-size: 12px;
          color: #666;
        }
        .tag-list {
          margin-left: 20px;
          color: #999;
          font-size: 12px;
        }
      }

      .func-list {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .func {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          z-index: 1;
          opacity: 0.5;
          transition: opacity ease 250ms;
          cursor: pointer;
          i {
            display: block;
            font-size: 18px;
            color: #939393;
          }
          &:hover {
            opacity: 1;
          }
        }
      }
    }
    .dynamic-pic {
      position: relative;
      width: 100%;

      .image {
        position: relative;
        display: block;
        width: 100%;
        height: 250px;
        z-index: 0;
      }
    }

    .card-body {
      padding: 10px 16px;
      .title {
        margin-bottom: 10px;
        font-size: 16px;
        line-height: 22px;
        height: 22px;
        color: #666;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .desc {
        font-size: 12px;
        color: #666;
        line-height: 20px;
        height: 60px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}

.el-upload--picture-card {
  position: relative;
  margin-bottom: 10px;
  margin-right: 10px;
  .hover {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.25s;
    z-index: 1;
    &:hover {
      opacity: 1;
    }
    i {
      flex: 1;
      color: rgba(255, 255, 255, 0.75);
      &:hover {
        color: #ffcb2b;
      }
    }
  }
  .el-image {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
}
.el-upload--picture-card i {
  line-height: 100px;
}
</style>