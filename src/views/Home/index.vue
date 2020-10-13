<template>
  <div class="home">
    <div class="box-group">
      <div class="box">
        <div class="box-flex">
          <span class="box-t">平台用户</span>
          <span class="box-num">{{ allUserCount }}</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">付费人次</span>
          <span class="box-num">{{ orderCount }}</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">下载数</span>
          <span class="box-num">{{ downloadCount }}</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">活动参与人数</span>
          <span class="box-num">{{ actPersonCount }}</span>
        </div>
      </div>
      <div class="box">
        <div class="box-flex">
          <span class="box-t">代理产品</span>
          <span class="box-num">{{ productCount }}</span>
        </div>
      </div>
    </div>

    <el-card
      shadow="never"
      :body-style="{ padding: '0px' }"
      style="width: 100%"
    >
      <div slot="header" class="clearfix">
        <span>活动</span>
      </div>

      <div class="box-group" style="margin: 0">
        <div class="box">
          <div class="box-flex">
            <span class="box-t">上架总数</span>
            <span class="box-num">{{ actAllCount }}</span>
          </div>
        </div>
				<div class="box">
          <div class="box-flex">
            <span class="box-t">新增报名用户数(同比昨天)</span>
            <span class="box-num">{{ dayActPersonCount }}</span>
          </div>
				</div>
				<div class="box">
					<div class="box-flex">
            <span class="box-t">新增报名用户数(同比7天前)</span>
            <span class="box-num">{{ weekActPersonCount }}</span>
          </div>
        </div>

				<div class="box">
					<div class="box-flex">
            <span class="box-t">新增报名用户数(同比30天前)</span>
            <span class="box-num">{{ monthActPersonCount }}</span>
          </div>
        </div>
      </div>
    </el-card>
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
      orderCount: 0,
      actPersonCount: 0,

			actAllCount: 0,
			dayActPersonCount: 0,
			weekActPersonCount: 0,
			monthActPersonCount: 0,
    };
  },
  mounted() {
    this.getUserCount();
    this.getDownloadCount();
    this.getProductCount();
    this.getOrderCount();
    this.getActPersonCount();

		this.getActCount();
		this.getDayActPerson();
		this.getWeekActPerson();
		this.getMonthActPerson();
  },
  methods: {
    getUserCount() {
      var query = this.$Bmob.Query("_User");
      query.equalTo("isCustomer", "==", true);
      query.count().then((count) => {
        this.allUserCount = count;
      });
    },
    getDownloadCount() {
      let count = 0;
      var query = this.$Bmob.Query("download");
      query.find().then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          count += data[i].downloads ? data[i].downloads : 0;
        }
        this.downloadCount = count;
      });
    },
    getProductCount() {
      var query = this.$Bmob.Query("product");
      query.count().then((count) => {
        this.productCount = count;
      });
    },

    getOrderCount() {
      var query = this.$Bmob.Query("order_list");
      query.count().then((count) => {
        this.orderCount = count;
      });
    },
    getActPersonCount() {
      var query = this.$Bmob.Query("activity_person");
      query.count().then((count) => {
        this.actPersonCount = count;
      });
    },

    // 活动上架总数
    getActCount() {
      const activityQuery = this.$Bmob.Query("activity");
      activityQuery.equalTo("notDelete", "==", true);
      activityQuery.count().then((count) => {
        this.actAllCount = count;
      });
    },

    // 昨日同比前天新增报名用户数
    async getDayActPerson() {
      const dayOneQuery = this.$Bmob.Query("activity_person");
			dayOneQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
      dayOneQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2));
			let dayOne = await dayOneQuery.count();

			const dayTwoQuery = this.$Bmob.Query("activity_person");
			dayTwoQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2));
      dayTwoQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 3));
			let dayTwo = await dayTwoQuery.count();

			this.dayActPersonCount = dayOne - dayTwo;
		},
		
		// 昨日同比7天前新增报名用户数
		async getWeekActPerson() {
			const weekOneQuery = this.$Bmob.Query("activity_person");
			weekOneQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
      weekOneQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
			let weekOne = await weekOneQuery.count();
			
			const weekTwoQuery = this.$Bmob.Query("activity_person");
			weekTwoQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
      weekTwoQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 14));
			let weekTwo = await weekTwoQuery.count();

			this.weekActPersonCount = weekOne - weekTwo;
		},

		// 昨日同比30天前新增报名用户数
		async getMonthActPerson() {
			const monthOneQuery = this.$Bmob.Query("activity_person");
			monthOneQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
      monthOneQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30));
			let monthOne = await monthOneQuery.count();
			
			const monthTwoQuery = this.$Bmob.Query("activity_person");
			monthTwoQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30));
      monthTwoQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 60));
			let monthTwo = await monthTwoQuery.count();

			this.monthActPersonCount = monthOne - monthTwo;
		},
  },
};
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
