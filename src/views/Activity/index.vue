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

        <el-select v-model="selectSort" placeholder="请选择活动类型" clearable style="width: 150px">
          <el-option v-for="(item, $index) in sortList" :key="$index" :label="item.label" :value="item.value"></el-option>
        </el-select>

				<el-select v-model="applyStatus" placeholder="请选择报名状态" clearable style="width: 150px">
          <el-option v-for="(item, $index) in applyList" :key="$index" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <div class="input-group">
          <el-input type="text" placeholder="请输入标题关键字" v-model="searchText" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="dataSearch"
              class="el-button--primary"
            ></el-button>
          </el-input>
        </div>
      </div>
      
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        v-loading="loading"
      >
        <el-table-column label="活动标题" prop="title" min-width="250">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover">
              <el-image :src="scope.row.img" style="width: 150px;" fit="contain"></el-image>
              <template slot="reference">
                <div class="title">{{scope.row.title}}</div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="报名人数" prop="count" align="center" width="200">
          <template slot-scope="scope">
            <div
              v-loading="scope.row.loadData === true"
              element-loading-spinner="el-icon-loading">
              <template v-if="scope.row.num">
                <el-progress
                  :percentage="(scope.row.count > scope.row.num ? scope.row.num : scope.row.count) / scope.row.num * 100"
                  :show-text="false"
                  :stroke-width="12"
                  style="display: inline-block; width: 80px;"
                ></el-progress>
                <span
                  style="margin-left:10px;font-size: 12px;"
                >{{scope.row.count}} / {{scope.row.num}}</span>
              </template>
              <template v-else>
                <span style="color:#999;">未设置可报名人数</span>
              </template>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="活动时间" min-width="200">
          <template slot-scope="scope">
            <div style="font-size:12px;">开始时间：{{scope.row.startTime}}</div>
            <div style="font-size:12px;">结束时间：{{scope.row.endTime}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <template v-if="scope.row.status === 0">
              <div class="state">
                <span class="icon" style="background-color: #999;"></span>
                <span class="text">暂存中</span>
              </div>
            </template>
            <template v-else>
              <div class="state" v-if="new Date(scope.row.startTime).getTime() > Date.now()">
                <span class="icon" style="background-color: #999;"></span>
                <span class="text">未开始</span>
              </div>
              <div
                class="state"
                v-else-if="new Date(scope.row.endTime).getTime() > Date.now() && new Date(scope.row.startTime).getTime() < Date.now()"
              >
                <span class="icon" style="background-color: #FFCB2B;"></span>
                <span class="text">可报名</span>
              </div>
              <div class="state" v-else-if="new Date(scope.row.endTime).getTime() < Date.now()">
                <span class="icon" style="background-color: #999;"></span>
                <span class="text">已结束</span>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="toDo" width="550" label="操作">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="small"
              icon="el-icon-s-flag"
              v-if="scope.row.isTop === true"
              @click="setTop(scope.row.id, false)"
            >取消置顶</el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-s-flag"
              v-else
              @click="setTop(scope.row.id, true)"
            >首页置顶</el-button>

            <el-button
              type="primary"
              size="small"
              icon="el-icon-finished"
              @click="audit(scope.row.id, scope.row.title)"
            >报名人</el-button>

            <!-- <el-button size="small" @click="$router.push({path: '/activity/channel', query: {id: scope.row.id}})">渠道</el-button> -->

            <el-button-group style="margin-left: 15px;">
              <el-button size="small" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="del(scope.row.id)"
                :disabled="scope.row.count > 0"
              >删除</el-button>
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
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",

      pageSize: 10,
      skip: 0,
      tableData: [],
      current: 1,
      total: 0,
      loading: false,

      isTops: 0,

      selectSort: '',
			sortList: [
        {
          label: '展览',
          value: 1,
        },
        {
          label: '知识',
          value: 2,
        },
        {
          label: '发现',
          value: 3,
        },
        {
          label: '其他',
          value: 4,
        },
			],
			applyStatus: '',
			applyList: [
				{
          label: '未开始',
          value: 1,
        },
        {
          label: '可报名',
          value: 2,
        },
        {
          label: '已结束',
          value: 3,
        },
			],
    };
  },
  activated() {
    this.getActivityList();
    this.getActivityCount();
    this.getIsTop();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      console.log(row, rowIndex);
      if (row.status === 0) {
        return "disabled";
      }
      return "";
    },
    setTop(id, boolean) {
      if (boolean === true) {
        if (this.isTops < 6) {
          const query = this.$Bmob.Query("activity");
          query.set("id", id); //需要修改的objectId
          query.set("isTop", boolean);
          query.save().then(() => {
            this.getActivityList();
            this.getIsTop();
          });
        } else {
          this.$message.error("已置顶满六个");
        }
      } else {
        const query = this.$Bmob.Query("activity");
        query.set("id", id); //需要修改的objectId
        query.set("isTop", boolean);
        query.save().then(() => {
          this.getActivityList();
          this.getIsTop();
        });
      }
    },
    dataSearch() {
      this.current = 1;
      this.skip = 0;
			this.getActivityList();
			this.getActivityCount();
    },
    getIsTop() {
      var query = this.$Bmob.Query("activity");
      query.equalTo("isTop", "==", true);
      query.count().then((count) => {
        this.isTops = count;
      });
    },

    async getActivityList() {
      this.loading = true;
      let dataList = [];

      let query = this.$Bmob.Query("activity");
      const skip = this.pageSize * (this.current - 1);
      query.order("-endTime");
      query.equalTo("notDelete", "==", true);
      if (this.selectSort !== "") {
        query.equalTo("sort", "==", this.selectSort);
			}
			if (this.searchText !== "") {
        query.equalTo("title", "==", { $regex: "" + this.searchText + ".*" });
			}
			if (this.applyStatus !== "") {
				if (this.applyStatus === 1) {
					query.equalTo("startTime", ">", {
						"__type": "Date",
						"iso": new Date()
					});
				} else if (this.applyStatus === 2) {
					query.equalTo("startTime", "<=", {
						"__type": "Date",
						"iso": new Date()
					});
					query.equalTo("endTime", ">", {
						"__type": "Date",
						"iso": new Date()
					});
				} else if (this.applyStatus === 3) {
					query.equalTo("endTime", "<", {
						"__type": "Date",
						"iso": new Date()
					});
				}
			}
      query.limit(this.pageSize);
      query.skip(skip);
      let data = await query.find();

      this.loading = false;

      for (let i = 0; i < data.length; i += 1) {
        for (let key in data[i].startTime) {
          if (key === "iso") {
            data[i].startTime = data[i].startTime[key];
          }
        }
        for (let key in data[i].endTime) {
          if (key === "iso") {
            data[i].endTime = data[i].endTime[key];
          }
        }

        dataList.push({
          id: data[i].objectId,
          img: data[i].imgSrc,
          title: data[i].title,
          desc: data[i].desc,
          count: 0,
          num: 0,
          startTime: this.$moment(data[i].startTime).format("YYYY-MM-DD HH:mm"),
          endTime: this.$moment(data[i].endTime).format("YYYY-MM-DD HH:mm"),
          status: data[i].status,
          isTop: data[i].isTop,
          loadData: true,
        });
      }

      this.tableData = dataList;

      // 库存
      for (let i = 0; i < dataList.length; i += 1) {
        const pointer = this.$Bmob.Pointer("activity");
        const poiID = pointer.set(dataList[i].id);

        const skusQuery = this.$Bmob.Query("skus");

        skusQuery.equalTo("activityId", "==", poiID);
        let res = await skusQuery.find();
        let num = 0;
        for (let x = 0; x < res.length; x += 1) {
          if (res[x].attrNum) {
            num = res[x].attrNum + num;
          }
        }
        this.$set(this.tableData[i], "num", num);
      }

      // 销量
      for (let i = 0; i < dataList.length; i += 1) {
        const pointer = this.$Bmob.Pointer("activity");
        const poiID = pointer.set(dataList[i].id);

        let apQuery = this.$Bmob.Query("activity_person");
        apQuery.equalTo("activity", "==", poiID);
        let apCount = await apQuery.count();
        this.$set(this.tableData[i], "count", apCount);
        this.$set(this.tableData[i], "loadData", false);
      }
    },
    getActivityCount() {
			var query = this.$Bmob.Query("activity");
			if (this.selectSort !== "") {
        query.equalTo("sort", "==", this.selectSort);
			}
			if (this.searchText !== "") {
        query.equalTo("title", "==", { $regex: "" + this.searchText + ".*" });
			}
			if (this.applyStatus !== "") {
				if (this.applyStatus === 1) {
					query.equalTo("startTime", ">", {
						"__type": "Date",
						"iso": new Date()
					});
				} else if (this.applyStatus === 2) {
					query.equalTo("startTime", "<=", {
						"__type": "Date",
						"iso": new Date()
					});
					query.equalTo("endTime", ">", {
						"__type": "Date",
						"iso": new Date()
					});
				} else if (this.applyStatus === 3) {
					query.equalTo("endTime", "<", {
						"__type": "Date",
						"iso": new Date()
					});
				}
			}
      query.equalTo("notDelete", "==", true);
      query.count().then((count) => {
        this.total = count;
      });
    },

    getSkus(id) {
      const pointer = this.$Bmob.Pointer("activity");
      const poiID = pointer.set(id);

      const skusQuery = this.$Bmob.Query("skus");

      skusQuery.equalTo("activityId", "==", poiID);
      skusQuery.find().then((res) => {
        let num = 0;
        for (let i = 0; i < res.length; i += 1) {
          num = res[i].attrNum + num;
        }
        return num;
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
        path: "/activity/pulish",
        query: { id },
      });
    },
    del(id) {
      this.$confirm("此操作将删除该活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var activity = this.$Bmob.Query("activity");
          activity.set("id", id);
          activity.set("notDelete", false);
          activity.save().then(() => {
            this.$message.success("删除成功！");
            this.getActivityList();
            this.getActivityCount();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    audit(id, title) {
      this.$router.push({
        path: "/activity/audit",
        query: {
          id,
          title,
        },
      });
    },
  },
};
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
			.el-select {
				margin-left: 15px;
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
    background-color: #fff;
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
    background-color: #fff;
    box-sizing: border-box;
  }
}

.el-table .disabled .el-table_1_column_1,
.el-table .disabled .el-table_1_column_2,
.el-table .disabled .el-table_1_column_3 {
  opacity: 0.5;
  text-decoration: line-through;
}
</style>
