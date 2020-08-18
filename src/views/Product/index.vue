<template>
  <div class="product-layer">
    <div class="page-top">
      <span class="top-title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>产品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <div class="top-func">
        <el-button type="primary" icon="el-icon-plus" @click="edit('新建')">新建产品</el-button>

        <div class="input-group">
          <el-input type="text" placeholder="请输入标题" v-model="searchText" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getlist" class="el-button--primary"></el-button>
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
          label="产品名"
          prop="title"
          min-width="250">
          <template slot-scope="scope">
            <div style="display: flex;width:340px;align-items: center;">
              <div :style="{
                width: '32px',
                height: '32px',
                backgroundImage: `url(${scope.row.imgSrc})`,
                backgroundSize: 'cover'}"></div>
                <div style="flex: 1; padding-left: 10px;">
                  <div>{{scope.row.title}}</div>
                </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="价格"
          align="center"
          min-width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.maxPrice && scope.row.minPrice">
            <span v-if="scope.row.maxPrice === scope.row.minPrice">{{scope.row.minPrice}}元</span>
            <span v-else>{{scope.row.minPrice}}~{{scope.row.maxPrice}}元</span>
            </template>
            <template v-else>尚未设置价格</template>
          </template>
        </el-table-column>
        <el-table-column
          label="库存"
          prop="num"
          align="center"
          min-width="150">
        </el-table-column>
        <el-table-column
          label="销量"
          prop="buyers"
          align="center"
          min-width="150">
        </el-table-column>
        <el-table-column
          label="操作"
          width="400">
          <template slot-scope="scope">
            <el-button type="info" size="small" icon="el-icon-s-flag" v-if="scope.row.recommend === true" @click="setTop(scope.row.objectId, false)">取消置顶</el-button>
            <el-button type="primary" size="small" icon="el-icon-s-flag" v-else @click="setTop(scope.row.objectId, true)">首页置顶</el-button>

            <el-button type="warning" icon="el-icon-edit" size="small" @click="edit('编辑', scope.row.objectId)">编辑</el-button>

            <el-button type="info" icon="el-icon-sunny" size="small" @click="setSell(scope.row.objectId, 0)" v-if="scope.row.status === -1">上架</el-button>
            <el-button type="primary" icon="el-icon-cloudy-and-sunny " size="small" @click="setSell(scope.row.objectId, -1)" v-if="scope.row.status === 0">下架</el-button>

            <el-button type="danger" @click="del(scope.row.objectId)" size="small" icon="el-icon-delete" v-if="scope.row.notDelete === true">删除</el-button>
            <el-button type="info" @click="replace(scope.row.objectId)" icon="el-icon-refresh-left" size="small" v-else>恢复</el-button>
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
      searchText: '',
      tableData: [],
      loading: false,

      isTops: 0,
    }
  },
  activated() {
    this.getlist();
  },
  methods: {
    getlist() {
      const proList = new Promise((resolve, reject) => {
        this.loading = true;
        let dataList = [];

        var ppQuery = this.$Bmob.Query('product_person');
        ppQuery.find().then((ppList) => {
					let productQuery = this.$Bmob.Query('product');
					productQuery.order('-updatedAt');
          if (this.searchText != '') {
            productQuery.equalTo('title', '===', this.searchText);
          }
          productQuery.find().then((data) => {
            for (let i = 0; i < data.length; i += 1) {

              // 获取销售人数
              let buyers = 0;
              for (let j = 0; j < ppList.length; j += 1) {
                if (data[i].objectId === ppList[j].product.objectId) {
                  buyers += 1;
                }
              }

              dataList.push({
                ...data[i],
                buyers,
              });
            }
            resolve(dataList);
          }).catch((err) => {
            reject(err);
          });
        });
      })

      proList.then((respon) => {
        const dataList = respon;

				dataList.sort((a, b) => {
					return b.status - a.status;
				});
        for (let i = 0; i < dataList.length; i += 1) {
          const pointer = this.$Bmob.Pointer('product')
          const poiID = pointer.set(dataList[i].objectId);

          const skusQuery = this.$Bmob.Query('skus');
          
          skusQuery.equalTo('productId', '==', poiID);
          skusQuery.find().then((res) => {
            let ar = [];
            let num = 0;
            for (let x = 0; x < res.length; x += 1) {
              if (res[x].attrNum) {
                num = res[x].attrNum + num;
              }
              ar.push(res[x].attrPrice);
            }

            dataList[i].num = num;
            if (ar.length > 0) {
              dataList[i].maxPrice = ar.sort()[ar.length - 1];
              dataList[i].minPrice = ar.sort()[0];
            }

						this.$set(this.tableData, i, dataList[i]);
						if (this.tableData.length === dataList.length) {
							this.loading = false;
						}
					});
				}
      })
    },
    setTop(id, boolean) {
      const query = this.$Bmob.Query('product');
      query.set('id', id); //需要修改的objectId
      query.set('recommend', boolean);
      query.save().then(() => {
        this.getlist();
        this.getIsTop();
      });
    },
    getIsTop() {
      var query = this.$Bmob.Query('product');
      query.equalTo('recommend', '==', true);
      query.count().then((count) => {
        this.isTops = count;
      });
    },
    setSell(id, status) {
      const query = this.$Bmob.Query('product');
      query.set('id', id); //需要修改的objectId
      query.set('status', status);
      query.save().then(() => {
        this.getlist();
      });
    },
    edit(type, id) {
      this.visible = true;
      this.dialogTitle = type;

      switch (type) {
        case '新建':
          this.$router.push('/product/item');
          break;
        case '编辑':
          this.$router.push({
            path: '/product/item',
            query: {
              id,
            },
          });

          break;
        default:
          break;
      }
    },

    del(id) {
      this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var product = this.$Bmob.Query('product');
        product.set('id', id);
        product.set('notDelete', false);
        product.save().then(() => {
          this.$message.success('删除成功！');
          this.getlist();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    replace(id) {
      this.$confirm('此操作将恢复该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var query = this.$Bmob.Query('product');
        query.set('id', id);
        query.set('notDelete', true);
        query.save().then(() => {
          this.$message.success('恢复成功！');
          this.getlist();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .product-layer {
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
  }
</style>
