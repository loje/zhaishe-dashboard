<template>
  <div class="images-page">
    <el-image class="img" v-for="(item, $index) in list" :key="$index" :src="item.url" fit="cover" lazy></el-image>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      const that = this;
      var query = new this.$AV.Query('_File');
      query.descending('createdAt');
      query.find().then(function (data) {
        for (let i = 0; i < data.length; i += 1) {
          that.list.push({
            url: data[i].get('url'),
          });
        }
        // students 是包含满足条件的 Student 对象的数组
      });
    },
  },
}
</script>

<style lang="scss" scoped>
  .images-page {
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
    background-color: #fff;
    box-sizing: border-box;
    .img {
      width: 100px;
      height: 100px;
      border: 1px solid #fafafa;
      &:hover {
        border-color: #999;
      }
    }
  }
</style>
