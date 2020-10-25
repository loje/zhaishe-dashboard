<template>
  <div class="home">
    <el-card
      shadow="never"
      :body-style="{ padding: '0px' }"
      style="margin-bottom: 15px; width: 100%"
    >
      <div slot="header" class="clearfix">
        <span>用户</span>
      </div>
      <div class="box-group">
        <div class="box">
          <div class="box-flex">
            <span class="box-t">总用户数</span>
            <span class="box-num">{{ allUserCount }}</span>
          </div>
        </div>
        <div class="box">
          <div class="box-flex">
            <span class="box-t">昨日新增</span>
            <span class="box-num">{{ dailyUserCount }}</span>
          </div>
        </div>
        <div class="box">
          <div class="box-flex">
            <span class="box-t">上周新增</span>
            <span class="box-num">{{ lastWeekUserCount }}</span>
          </div>
        </div>
        <div class="box">
          <div class="box-flex">
            <span class="box-t">上月新增</span>
            <span class="box-num">{{ lastMonthUserCount }}</span>
          </div>
        </div>
        <!-- <div class="box">
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
        </div> -->
      </div>
      <div class="canvas-layer">
        增长趋势：
        <el-select v-model="userCanvasType" @change="getUserCanvasData" size="small" style="margin-bottom: 15px;">
          <el-option label="前24小时" :value="1"></el-option>
          <el-option label="前7天" :value="2"></el-option>
          <el-option label="上个月" :value="3"></el-option>
        </el-select>
        <div class="the-canvas" id="userCanvas"></div>
      </div>
    </el-card>

    <el-card
      shadow="never"
      :body-style="{ padding: '0px' }"
      style="margin-bottom: 15px; width: 100%"
    >
      <div slot="header" class="clearfix">
        <span>付费用户</span>
      </div>
      <div class="box-group">
        <div class="box">
          <div class="box-flex">
            <!-- <span class="box-t">昨日新增</span>
            <span class="box-num">{{ allUserCount }}</span> -->
          </div>
        </div>
      </div>
    </el-card>

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
            <span class="box-t">昨日报名用户数</span>
            <span class="box-num">{{ dayActPersonCount }}</span>
          </div>
				</div>
				<div class="box">
					<div class="box-flex">
            <span class="box-t">上周报名用户数</span>
            <span class="box-num">{{ weekActPersonCount }}</span>
          </div>
        </div>

				<div class="box">
					<div class="box-flex">
            <span class="box-t">上月报名用户数</span>
            <span class="box-num">{{ monthActPersonCount }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// @ is an alias to /src
import { Area } from '@antv/g2plot';

export default {
  data() {
    return {
      allUserCount: 0,
      dailyUserCount: 0,
      lastWeekUserCount: 0,
      lastMonthUserCount: 0,

      userCanvasType: 1,
      canvasUserData: [],
      // downloadCount: 0,
      // productCount: 0,
      // orderCount: 0,
      // actPersonCount: 0,

			actAllCount: 0,
			dayActPersonCount: 0,
			weekActPersonCount: 0,
			monthActPersonCount: 0,
    };
  },
  mounted() {
    this.getUserCount();
    this.getDailyUserCount();
    this.getLastWeekUserCount();
    this.getLastMonthUserCount();
    // this.getDownloadCount();
    // this.getProductCount();
    // this.getOrderCount();
    // this.getActPersonCount();

    this.getUserCanvasData();

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
    getDailyUserCount() {
      let yesterdayStart = `${this.$moment().subtract('days', 1).format('YYYY/MM/DD')} 00:00:00`;
      let yesterdayEnd = `${this.$moment().subtract('days', 1).format('YYYY/MM/DD')} 23:59:59`;

      var query = this.$Bmob.Query("_User");
      query.equalTo("isCustomer", "==", true);
      query.equalTo("createdAt", "<=", new Date(yesterdayEnd));
      query.equalTo("createdAt", ">=", new Date(yesterdayStart));
      query.count().then((count) => {
        this.dailyUserCount = count;
      });
    },
    getLastWeekUserCount() {
      let weekOfday = parseInt(this.$moment().format('d'));
      let lastWeekStart = `${this.$moment().subtract(weekOfday + 7, 'days').format('YYYY/MM/DD')} 00:00:00` // 周一日期
      let lastWeekEnd = `${this.$moment().subtract(weekOfday + 1, 'days').format('YYYY/MM/DD')} 23:59:59` // 周日日期

      var query = this.$Bmob.Query("_User");
      query.equalTo("isCustomer", "==", true);
      query.equalTo("createdAt", "<=", new Date(lastWeekEnd));
      query.equalTo("createdAt", ">=", new Date(lastWeekStart));
      query.count().then((count) => {
        this.lastWeekUserCount = count;
      });
    },
    getLastMonthUserCount() {
      let lastMonthStart = `${this.$moment().subtract('month', 1).format('YYYY/MM') + '-01'} 00:00:00`
      let lastMonthEnd = `${this.$moment(lastMonthStart).subtract('month', -1).add('days', -1).format('YYYY/MM/DD')} 23:59:59`

      var query = this.$Bmob.Query("_User");
      query.equalTo("isCustomer", "==", true);
      query.equalTo("createdAt", "<=", new Date(lastMonthEnd));
      query.equalTo("createdAt", ">=", new Date(lastMonthStart));
      query.count().then((count) => {
        this.lastMonthUserCount = count;
      });
    },
    
    async getUserCanvasData() {
      const list = [];
      // 前24小时增长
      if (this.userCanvasType === 1) {
        for (let i = 0; i < 24; i += 1) {
          let startHousr = this.$moment().subtract(i + 1, 'hours').format('YYYY/MM/DD HH:mm:ss');
          let endHours = this.$moment().subtract(i + 2, 'hours').format('YYYY/MM/DD HH:mm:ss');

          const query = this.$Bmob.Query("_User");
          query.equalTo("isCustomer", "==", true);
          query.equalTo("createdAt", "<=", new Date(startHousr));
          query.equalTo("createdAt", ">", new Date(endHours));
          let data = await query.count();
          list.push({ date: this.$moment(endHours).format('MM/DD HH:mm'), value: data })
        }
      } else if (this.userCanvasType === 2) {
        for (let i = 0; i < 7; i += 1) {
          let start = this.$moment().subtract(i, 'days').format('YYYY/MM/DD');
          let end = this.$moment().subtract(i + 1, 'days').format('YYYY/MM/DD');

          const query = this.$Bmob.Query("_User");
          query.equalTo("isCustomer", "==", true);
          query.equalTo("createdAt", "<=", new Date(start));
          query.equalTo("createdAt", ">", new Date(end));
          let data = await query.count();
          list.push({ date: this.$moment(end).format('YYYY/MM/DD'), value: data })
        }
      } else if (this.userCanvasType === 3) {
        for (let i = 0; i < 30; i += 1) {
          let start = this.$moment().subtract(i, 'days').format('YYYY/MM/DD');
          let end = this.$moment().subtract(i + 1, 'days').format('YYYY/MM/DD');

          const query = this.$Bmob.Query("_User");
          query.equalTo("isCustomer", "==", true);
          query.equalTo("createdAt", "<=", new Date(start));
          query.equalTo("createdAt", ">", new Date(end));
          let data = await query.count();
          list.push({ date: this.$moment(end).format('YYYY/MM/DD'), value: data })
        }
      }

      this.canvasUserData = list.reverse();
      this.getUserCanvas();
    },
    getUserCanvas() {
			const that = this;
			document.getElementById('userCanvas').innerHTML = '';
			const linePlot = new Area('userCanvas', {
				data: that.canvasUserData,
				xField: 'date',
				yField: 'value',
			});

			linePlot.render();
		},
    // getDownloadCount() {
    //   let count = 0;
    //   var query = this.$Bmob.Query("download");
    //   query.find().then((data) => {
    //     for (let i = 0; i < data.length; i += 1) {
    //       count += data[i].downloads ? data[i].downloads : 0;
    //     }
    //     this.downloadCount = count;
    //   });
    // },
    // getProductCount() {
    //   var query = this.$Bmob.Query("product");
    //   query.count().then((count) => {
    //     this.productCount = count;
    //   });
    // },

    // getOrderCount() {
    //   var query = this.$Bmob.Query("order_list");
    //   query.count().then((count) => {
    //     this.orderCount = count;
    //   });
    // },
    // getActPersonCount() {
    //   var query = this.$Bmob.Query("activity_person");
    //   query.count().then((count) => {
    //     this.actPersonCount = count;
    //   });
    // },

    // 活动上架总数
    getActCount() {
      const activityQuery = this.$Bmob.Query("activity");
      activityQuery.equalTo("notDelete", "==", true);
      activityQuery.count().then((count) => {
        this.actAllCount = count;
      });
    },

    // 昨日报名用户数
    getDayActPerson() {
      // const dayOneQuery = this.$Bmob.Query("activity_person");
			// dayOneQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
      // dayOneQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2));
			// let dayOne = await dayOneQuery.count();

			// const dayTwoQuery = this.$Bmob.Query("activity_person");
			// dayTwoQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2));
      // dayTwoQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 3));
			// let dayTwo = await dayTwoQuery.count();

      // this.dayActPersonCount = dayOne - dayTwo;
      let yesterdayStart = `${this.$moment().subtract('days', 1).format('YYYY/MM/DD')} 00:00:00`;
      let yesterdayEnd = `${this.$moment().subtract('days', 1).format('YYYY/MM/DD')} 23:59:59`;

      const query = this.$Bmob.Query("activity_person");
      query.equalTo("createdAt", "<=", new Date(yesterdayEnd));
      query.equalTo("createdAt", ">=", new Date(yesterdayStart));
      query.count().then((count) => {
        this.dayActPersonCount = count;
      });
		},
		
		// 上周报名用户数
		getWeekActPerson() {
			// const weekOneQuery = this.$Bmob.Query("activity_person");
			// weekOneQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
      // weekOneQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
			// let weekOne = await weekOneQuery.count();
			
			// const weekTwoQuery = this.$Bmob.Query("activity_person");
			// weekTwoQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
      // weekTwoQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 14));
			// let weekTwo = await weekTwoQuery.count();

      // this.weekActPersonCount = weekOne - weekTwo;
      let weekOfday = parseInt(this.$moment().format('d'));
      let lastWeekStart = `${this.$moment().subtract(weekOfday + 7, 'days').format('YYYY/MM/DD')} 00:00:00` // 周一日期
      let lastWeekEnd = `${this.$moment().subtract(weekOfday + 1, 'days').format('YYYY/MM/DD')} 23:59:59` // 周日日期

      const query = this.$Bmob.Query("activity_person");
      query.equalTo("createdAt", "<=", new Date(lastWeekEnd));
      query.equalTo("createdAt", ">=", new Date(lastWeekStart));
      query.count().then((count) => {
        this.weekActPersonCount = count;
      });
		},

		// 上月报名用户数
		getMonthActPerson() {
			// const monthOneQuery = this.$Bmob.Query("activity_person");
			// monthOneQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
      // monthOneQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30));
			// let monthOne = await monthOneQuery.count();
			
			// const monthTwoQuery = this.$Bmob.Query("activity_person");
			// monthTwoQuery.equalTo("createdAt", "<", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30));
      // monthTwoQuery.equalTo("createdAt", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 60));
			// let monthTwo = await monthTwoQuery.count();

      // this.monthActPersonCount = monthOne - monthTwo;
      let lastMonthStart = `${this.$moment().subtract('month', 1).format('YYYY/MM') + '-01'} 00:00:00`
      let lastMonthEnd = `${this.$moment(lastMonthStart).subtract('month', -1).add('days', -1).format('YYYY/MM/DD')} 23:59:59`

      var query = this.$Bmob.Query("activity_person");
      query.equalTo("createdAt", "<=", new Date(lastMonthEnd));
      query.equalTo("createdAt", ">=", new Date(lastMonthStart));
      query.count().then((count) => {
        this.monthActPersonCount = count;
      });
		},
  },
};
</script>

<style lang="scss" scope>
.box-group {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25%;
    height: 100px;
    background-color: #fff;
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

.canvas-layer {
  padding: 0 15px 10px;
  box-sizing: border-box;
  .the-canvas {
    width: 100%;
    height: 150px;
  }
}

</style>
