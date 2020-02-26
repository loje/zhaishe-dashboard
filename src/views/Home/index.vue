<template>
  <div class="home">
    <div class="box-group">
      <div class="box">
        <div class="box-flex">
          <span class="box-t">平台用户</span>
          <span class="box-num">{{allUserCount}}</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">付费用户</span>
          <span class="box-num">1000</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">下载数</span>
          <span class="box-num">{{downloadCount}}</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">活动参与人数</span>
          <span class="box-num">1000</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">代理产品</span>
          <span class="box-num">{{productCount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  data() {
    return {
      allUserCount: 0,
      downloadCount: 0,
      productCount: 0,
    }
  },
  mounted() {
    this.getUserCount();
    this.getDownloadCount();
    this.getProductCount();
  },
  methods: {
    getUserCount() {
      var query = this.$Bmob.Query('_User');
      query.equalTo('isCustomer', '==', true);
      query.count().then((count) => {
        this.allUserCount = count;
      });
    },
    getDownloadCount() {
      let count = 0;
      var query = this.$Bmob.Query('download');
      query.find().then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          count += data[i].downloads ? data[i].downloads : 0;
        }
        this.downloadCount = count;
      });
    },
    getProductCount() {
      var query = this.$Bmob.Query('product');
      query.count().then((count) => {
        this.productCount = count;
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
  },
}
</script>

<style lang="scss" scope>
  .box-group {
    display: flex;
    width: 100%;
    margin-bottom: 37px;
    justify-content: space-between;
    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 300px;
      height: 100px;
      background-color: #fff;
      text-align: center;
      .box-flex {
        .box-t {
          line-height: 17px;
          color: #999;
        }
        .box-num {
          margin-left: 20px;
          font-size: 40px;
          line-height: 40px;
          font-family: PingFang SC Regular;
          color: #333;
        }
      }
    }
  }
</style>
