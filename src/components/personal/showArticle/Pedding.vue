<template>
  <div id="pedding">
    <table class="tab">
      <thead>
        <tr>
          <th>文章标题</th>
          <th>文章内容</th>
          <th>上传时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody v-if="result.length !== 0">
        <tr v-for="(item) in result" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.text}}</td>
          <td>{{item.ctime}}</td>
          <td>
            <el-button type="danger" size="mini" @click="deleteArticle(item.id)">删除</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="result.length===0" style="text-align:center">暂无数据</div>
    <Masker :loading="loading" />
  </div>
</template>

<script>
import {
  queryArticleByUserIdAndType,
  deleteArticleById
} from "@/api/articles/articles";
import Masker from "@/components/mask/Masker";
export default {
  components: {
    Masker
  },
  data() {
    return {
      about: this.$route.params.about,
      result: [],
      loading: false
    };
  },
  mounted() {
    this.requestData();
  },
  watch: {
    $route() {
      this.requestData();
    }
  },
  methods: {
    async requestData() {
      this.loading = true;
      this.about = this.$route.params.about;
      const result = await queryArticleByUserIdAndType(
        this.$store.state.user.userId,
        this.about,
        -1
      );
      this.result = result.result;
      this.loading = false;
    },
    async deleteArticle(id) {
      await deleteArticleById(id);
      this.requestData();
    }
  }
};
</script>

<style lang="less">
</style>