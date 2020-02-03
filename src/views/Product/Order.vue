<template>
  <div class="product-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>产品列表</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
    <div class="layer-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="订单号"
          prop="objectId"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="订单金额"
          prop="total_fee"
          min-width="200">
        </el-table-column>
        <el-table-column
          label="支付状态"
          prop="trade_state_desc"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="相关产品"
          prop="productName"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="购买用户"
          prop="userName"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="购买时间"
          prop="createdAt"
          min-width="200">
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="comfilmDelivery(scope.row.objectId)" v-if="!scope.row.delivery">确认发货</el-button>
            <el-button type="danger" size="small" @click="cancelDelivery(scope.row.objectId)" v-else>取消发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;
      let proList = [];
      let userList = [];

      let orderQuery = this.$Bmob.Query('order_list');

      orderQuery.equalTo('sort', '===', 'product');
      orderQuery.find().then((res) => {
        this.loading = false;
        let list = res;

        let productQuery = this.$Bmob.Query('product');
        productQuery.find().then((prores) => {
          proList = prores;
          let userQuery = this.$Bmob.Query('_User');
          userQuery.find().then((userres) => {
            userList = userres;

            for (let i = 0; i < list.length; i += 1) {
              for (let j = 0; j < proList.length; j += 1) {
                if (list[i].product.objectId === proList[j].objectId) {
                  list[i].productName = proList[j].title;

                  for (let k = 0; k < userList.length; k += 1) {
                    if (list[i].user.objectId === userList[k].objectId) {
                      list[i].userName = `${userList[k].name}(${userList[k].username})`;

                      list[i] = {
                        ...list[i],
                        ...list[i].payReslut,
                      };
                    }
                  }
                }
              }
            }
            this.tableData = list;
          });
        });
      });
    },
    comfilmDelivery(id) {
      const query = this.$Bmob.Query('order_list');
      query.set('id', id); //需要修改的objectId
      query.set('delivery', true);
      query.save().then(() => {
        this.getlist();
      });
    },
    cancelDelivery(id) {
      const query = this.$Bmob.Query('order_list');
      query.set('id', id); //需要修改的objectId
      query.set('delivery', false);
      query.save().then(() => {
        this.getlist();
      });
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
</style>
