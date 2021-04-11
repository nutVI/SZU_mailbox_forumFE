<template>
  <el-table :data="gridData">
    <el-table-column width="300" property="date" label="日期"></el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        gridData: [{
          date: '2016-05-02',
        }, {
          date: '2016-05-04',
        }, {
          date: '2016-05-01',
        }, {
          date: '2016-05-03',
        }]
      };
    },
    mounted() {
      console.log('?')
    }
  }
</script>

<style>

</style>