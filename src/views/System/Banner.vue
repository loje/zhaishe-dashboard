<template>
  <div class="swiper-layer">
    <div class="swiper-box">
      <div class="box-left">
        <swiper v-if="bannerLeft && bannerLeft.length > 0" :options="leftSwiperOption" ref="leftSwiper">
          <template v-for="(item, $index) in bannerLeft">
          <swiper-slide :key="$index">
            <div class="img" :style="{backgroundImage:`url(${item.imgSrc})`}"></div>
          </swiper-slide>
          </template>
        </swiper>
      </div>
      <div class="box-right">
        <swiper v-if="bannerRight && bannerRight.length > 0" :options="rightSwiperOption" ref="rightSwiper">
          <template v-for="(item, $index) in bannerRight">
          <swiper-slide :key="$index">
            <div class="img" :style="{backgroundImage:`url(${item.imgSrc})`}"></div>
          </swiper-slide>
          </template>
        </swiper>
      </div>
    </div>

    <div class="profile">
      <el-divider content-position="left">左侧轮播图(730px * 340px)</el-divider>
      <template v-if="bannerLeft.length > 0">
        <template v-for="(item, $index) in bannerLeft">
        <div class="el-upload el-upload--picture-card" :key="$index + 'left'">
          <div class="hover">
            <i class="el-icon-delete" @click="del(item.id)"></i>
            <i class="el-icon-link" @click="setlink(item)"></i>
          </div>
          <el-image :src="item.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
        </div>
        </template>
      </template>
      <div @click="importLeftClick" class="el-upload el-upload--picture-card" v-loading="imgLeftLoading">
        <i class="el-icon-plus"></i>
        <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadLeftFile" class="el-upload__input" :multiple="false" name="file" ref="leftInput" type="file">
      </div>

      <el-divider content-position="left">右侧轮播图(350px * 160px)</el-divider>
      <template v-if="bannerRight.length > 0">
        <template v-for="(item, $index) in bannerRight">
        <div class="el-upload el-upload--picture-card" :key="$index + 'right'">
          <div class="hover">
            <i class="el-icon-delete" @click="del(item.id)"></i>
            <i class="el-icon-link" @click="setlink(item)"></i>
          </div>
          <el-image :src="item.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
        </div>
        </template>
      </template>
      <div @click="importRightClick" class="el-upload el-upload--picture-card" v-loading="imgRightLoading">
        <i class="el-icon-plus"></i>
        <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadRightFile" class="el-upload__input" :multiple="false" name="file" ref="rightInput" type="file">
      </div>
    </div>

    <el-dialog title="设置链接"
      :visible.sync="dialogVisible"
      v-loading="dialogLoading"
      @close="dialogClose"
      width="600px">
      <el-image :src="dialog.src" style="border-radius: 10px;"></el-image>
      <el-input type="text" v-model="dialog.link" placeholder="开头请输入http://">
        <template slot="prepend">指向链接：</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confilm">确 定</el-button>
      </span>
    </el-dialog>

    <div class="line"></div>

    <div class="download-box">
      <swiper v-if="downloadBanner && downloadBanner.length > 0" :options="downloadSwiperOption" ref="downloadSwiper">
        <template v-for="(item, $index) in downloadBanner">
        <swiper-slide :key="$index">
          <div class="img" :style="{backgroundImage:`url(${item.imgSrc})`}"></div>
        </swiper-slide>
        </template>
      </swiper>
    </div>

    <div class="profile">
      <el-divider content-position="left">资源列表轮播图(870px * 230px)</el-divider>
      <template v-if="downloadBanner.length > 0">
        <template v-for="(item, $index) in downloadBanner">
        <div class="el-upload el-upload--picture-card" :key="$index + 'left'">
          <div class="hover">
            <i class="el-icon-delete" @click="del(item.id)"></i>
            <i class="el-icon-link" @click="setlink(item)"></i>
          </div>
          <el-image :src="item.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
        </div>
        </template>
      </template>
      <div @click="importDownloadClick" class="el-upload el-upload--picture-card" v-loading="imgDownloadLoading">
        <i class="el-icon-plus"></i>
        <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadDownloadFile" class="el-upload__input" :multiple="false" name="file" ref="downloadInput" type="file">
      </div>
    </div>

    <div class="line"></div>

    <div class="tool-box">
      <swiper v-if="toolBanner && toolBanner.length > 0" :options="toolSwiperOption" ref="toolSwiper">
        <template v-for="(item, $index) in toolBanner">
        <swiper-slide :key="$index">
          <div class="img" :style="{backgroundImage:`url(${item.imgSrc})`}"></div>
        </swiper-slide>
        </template>
      </swiper>
    </div>

    <div class="profile">
      <el-divider content-position="left">工具列表轮播图(360px * 187px)</el-divider>
      <template v-if="toolBanner.length > 0">
        <template v-for="(item, $index) in toolBanner">
        <div class="el-upload el-upload--picture-card" :key="$index + 'left'">
          <div class="hover">
            <i class="el-icon-delete" @click="del(item.id)"></i>
            <i class="el-icon-link" @click="setlink(item)"></i>
          </div>
          <el-image :src="item.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
        </div>
        </template>
      </template>
      <div @click="importToolClick" class="el-upload el-upload--picture-card" v-loading="imgToolLoading">
        <i class="el-icon-plus"></i>
        <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadToolFile" class="el-upload__input" :multiple="false" name="file" ref="toolInput" type="file">
      </div>
    </div>

    <div class="line"></div>

    <div class="tool-ad">
      <div class="img" :style="{backgroundImage: `url(${toolAdBanner[0].imgSrc})`}" v-if="toolAdBanner && toolAdBanner.length > 0"></div>
    </div>
    <div class="profile">
      <el-divider content-position="left">工具列表右侧广告(220px * 150px)</el-divider>
      <template v-if="toolAdBanner.length > 0">
        <template v-for="(item, $index) in toolAdBanner">
        <div class="el-upload el-upload--picture-card" :key="$index + 'left'">
          <div class="hover">
            <i class="el-icon-delete" @click="del(item.id)"></i>
            <i class="el-icon-link" @click="setlink(item)"></i>
          </div>
          <el-image :src="item.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
        </div>
        </template>
      </template>
      <div @click="importToolAdClick" class="el-upload el-upload--picture-card" v-loading="imgToolAdLoading" v-if="toolAdBanner.length === 0">
        <i class="el-icon-plus"></i>
        <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadToolAdFile" class="el-upload__input" :multiple="false" name="file" ref="toolAdInput" type="file">
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      leftSwiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
        autoplay: true,
        loop : true,
        delay: 1000,
        pagination: {
          el: '.swiper-pagination',
        }
      },
      rightSwiperOption: {
        autoplay: true,
        loop : true,
        delay: 1000,
        direction : 'vertical',
        slidesPerView : 2,
        pagination: {
          el: '.swiper-pagination',
        }
      },
      bannerLeft: [],
      bannerRight: [],
      imgLeftLoading: false,
      imgRightLoading: false,

      dialogVisible: false,
      dialogLoading: false,
      dialog: {
        id: '',
        link: '',
        src: '',
      },

      downloadSwiperOption: {
        autoplay: true,
        loop : true,
        delay: 1000,
        pagination: {
          el: '.swiper-pagination',
        }
      },
      downloadBanner: [],
      imgDownloadLoading: false,

      toolSwiperOption: {
        autoplay: true,
        loop : true,
        delay: 1000,
        // direction : 'vertical',
        slidesPerView : 3,
        pagination: {
          el: '.swiper-pagination',
        }
      },
      toolBanner: [],
      imgToolLoading: false,
      toolAdBanner: [],
      imgToolAdLoading: false,
    }
  },
  computed: {
    swiper() {
      return this.$refs.leftSwiper.swiper;
    }
  },
  mounted() {
    this.getBanner();
  },
  methods: {
    confilm() {
      this.dialogLoading = true;
      let banner = this.$Bmob.Query('banner');
      banner.set('id', this.dialog.id);
      banner.set('link', this.dialog.link);
      banner.save().then(() => {
        this.dialogLoading = false;
        this.dialogVisible = false;
        this.dialog = {
          id: '',
          link: '',
          src: '',
        };
        this.getBanner();
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.dialog = {
        id: '',
        link: '',
        src: '',
      };
      this.getBanner();
    },
    getBanner() {
      var query = this.$Bmob.Query('banner');
      let bannerLeft = [];
      let bannerRight = [];
      let downloadBanner = [];
      let toolBanner = [];
      let toolAdBanner = [];

      query.find().then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          if (res[i].position && res[i].position === 'left') {
            bannerLeft.push({
              id: res[i].objectId,
              imgSrc: res[i].imgSrc,
              link: res[i].link
            });
          }
          if (res[i].position && res[i].position === 'right') {
            bannerRight.push({
              id: res[i].objectId,
              imgSrc: res[i].imgSrc,
              link: res[i].link
            });
          }
          if (res[i].position && res[i].position === 'download') {
            downloadBanner.push({
              id: res[i].objectId,
              imgSrc: res[i].imgSrc,
              link: res[i].link
            });
          }
          if (res[i].position && res[i].position === 'tool') {
            toolBanner.push({
              id: res[i].objectId,
              imgSrc: res[i].imgSrc,
              link: res[i].link
            });
          }
          if (res[i].position && res[i].position === 'toolAd') {
            toolAdBanner.push({
              id: res[i].objectId,
              imgSrc: res[i].imgSrc,
              link: res[i].link
            });
          }
        }
        this.bannerLeft = bannerLeft;
        this.bannerRight = bannerRight;
        this.downloadBanner = downloadBanner;
        this.toolBanner = toolBanner;
        this.toolAdBanner = toolAdBanner;
      });
    },
    importLeftClick() {
      this.imgLeftLoading = false;
      this.$refs.leftInput.value = null;
      this.$refs.leftInput.click();
    },
    importRightClick() {
      this.imgRightLoading = false;
      this.$refs.rightInput.value = null;
      this.$refs.rightInput.click();
    },
    importDownloadClick() {
      this.imgDownloadLoading = false;
      this.$refs.downloadInput.value = null;
      this.$refs.downloadInput.click();
    },
    importToolClick() {
      this.imgToolLoading = false;
      this.$refs.toolInput.value = null;
      this.$refs.toolInput.click();
    },
    importToolAdClick() {
      this.imgToolAdLoading = false;
      this.$refs.toolAdInput.value = null;
      this.$refs.toolAdInput.click();
    },
    uploadLeftFile(e) {
      const that = this;
      if (e.target.files) {
        let localFile  = e.target.files[0];
        if (localFile.size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(localFile.size / 1024)}kb,上传文件不得超过500kb`);
          return false;
        }
        this.imgLeftLoading = true;
        let file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          var newBanner = this.$Bmob.Query('banner');
          newBanner.set('position', 'left');
          newBanner.set('imgSrc', file[0].url);
          newBanner.save().then((res) => {
            this.imgLeftLoading = false;
            this.bannerLeft.push({
              id: res.objectId,
              imgSrc: file[0].url,
            });
            that.$refs.leftSwiper.update();
          });
        }, function () {
          this.imgLeftLoading = false;
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
        this.getBanner();
      }
    },
    uploadRightFile(e) {
      const that = this;
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (localFile.size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(localFile.size / 1024)}kb,上传文件不得超过500kb`);
          return false;
        }
        this.imgRightLoading = true;
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          var newBanner = this.$Bmob.Query('banner');
          newBanner.set('position', 'right');
          newBanner.set('imgSrc', file[0].url);
          newBanner.save().then((res) => {
            this.imgRightLoading = false;
            this.bannerRight.push({
              id: res.objectId,
              imgSrc: file[0].url,
            });
            that.$refs.rightSwiper.update();
          });
        }, function () {
          this.imgRightLoading = false;
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
        this.getBanner();
      }
    },
    uploadDownloadFile(e) {
      const that = this;
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (localFile.size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(localFile.size / 1024)}kb,上传文件不得超过500kb`);
          return false;
        }
        this.imgDownloadLoading = true;
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          var newBanner = this.$Bmob.Query('banner');
          newBanner.set('position', 'download');
          newBanner.set('imgSrc', file[0].url);
          newBanner.save().then((res) => {
            this.imgDownloadLoading = false;
            this.downloadBanner.push({
              id: res.objectId,
              imgSrc: file[0].url,
            });
            that.$refs.downloadSwiper.update();
          });
        }, function () {
          this.imgDownloadLoading = false;
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
        this.getBanner();
      }
    },
    uploadToolFile(e) {
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (localFile.size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(localFile.size / 1024)}kb,上传文件不得超过500kb`);
          return false;
        }
        this.imgToolLoading = true;
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          var newBanner = this.$Bmob.Query('banner');
          newBanner.set('position', 'tool');
          newBanner.set('imgSrc', file[0].url);
          newBanner.save().then((res) => {
            this.imgToolLoading = false;
            this.toolBanner.push({
              id: res.objectId,
              imgSrc: file[0].url,
            });
            this.$refs.toolSwiper.update();
          });
        }, () => {
          this.imgToolLoading = false;
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
        this.getBanner();
      }
    },
    uploadToolAdFile(e) {
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (localFile.size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(localFile.size / 1024)}kb,上传文件不得超过500kb`);
          return false;
        }
        this.imgToolAdLoading = true;
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          var newBanner = this.$Bmob.Query('banner');
          newBanner.set('position', 'toolAd');
          newBanner.set('imgSrc', file[0].url);
          newBanner.save().then((res) => {
            this.imgToolAdLoading = false;
            this.toolAdBanner.push({
              id: res.objectId,
              imgSrc: file[0].url,
            });
          });
        }, () => {
          this.imgToolAdLoading = false;
          // console.error(error);
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
        this.getBanner();
      }
    },
    del(id) {
      const that = this;
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        var banner = this.$Bmob.Query('banner');
        banner.destroy(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getBanner();
          that.$refs.leftSwiper.update();
          that.$refs.rightSwiper.update();
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    setlink(item) {
      this.dialogVisible = true;
      this.dialog.id = item.id;
      this.dialog.src = item.imgSrc;
      this.dialog.link = item.link;
    },
  },
}
</script>

<style lang="scss" scope>
  .swiper-box {
    display: flex;
    width: 1200px;
    height: 340px;
    border-radius: 10px;
    overflow: hidden;
    .box-left {
      width: 760px;
      height: 100%;
      background-color: #707A81;
      background-position: 50%;
      background-size: cover;
      .swiper-container{
        width: 100%;
        height: 100%;
        .img {
          width: 100%;
          height: 100%;
          background-position: 50%;
          background-size: cover;
        }
      }
    }
    .box-right {
      width: 440px;
      .swiper-container{
        width: 100%;
        height: 100%;
        .img {
          width: 100%;
          height: 100%;
          background-position: 50%;
          background-size: cover;
        }
      }
    }
  }
  .swiper-pagination-bullet-active {
    background-color: #fff;
  }

  .profile {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .el-upload--picture-card{
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
        background-color: rgba(0,0,0,0.5);
        opacity: 0;
        transition: opacity 0.25s;
        z-index: 1;
        &:hover {
          opacity: 1;
        }
        i {
          flex: 1;
          color: rgba(255,255,255,0.75);
          &:hover {
            color: #FFCB2B;
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
  }

  .line {
    margin: 30px 0;
    width: 100%;
    height: 1px;
    background-color: #ccc;
  }

  .download-box {
    width: 870px;
    height: 230px;
    background-color: #707A81;
    background-position: 50%;
    background-size: cover;
    .swiper-container{
      width: 100%;
      height: 100%;
      .img {
        width: 100%;
        height: 100%;
        background-position: 50%;
        background-size: cover;
      }
    }
  }

  .tool-box {
    width: 870px;
    height: 230px;
    background-color: #707A81;
    background-position: 50%;
    background-size: cover;
    .swiper-container{
      width: 100%;
      height: 100%;
      .img {
        width: 100%;
        height: 100%;
        background-position: 50%;
        background-size: cover;
      }
    }
  }

  .tool-ad {
    width: 220px;
    height: 150px;
    border-radius: 2px;
    overflow: hidden;
    .img {
      width: 100%;
      height: 100%;
      background-color: #707A81;
      background-position: 50%;
      background-size: cover;
    }
  }
</style>