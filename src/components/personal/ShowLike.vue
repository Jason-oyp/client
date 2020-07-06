<template>
  <div id="like">
    <table class="tab">
      <thead>
        <tr>
          <th>文章标题</th>
          <th>文章内容</th>
          <th>收藏时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody v-if="result.length !== 0">
        <tr v-for="(item) in result" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.text}}</td>
          <td>{{item.like_time}}</td>
          <td>
            <el-button
              type="primary"
              @click="toTitleDetail(item.article_id,item.type)"
              size="mini"
            >文章详情</el-button>
            <el-button type="danger" size="mini" @click="deleteArticle(item.article_id)">删除</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="result.length===0" style="text-align:center">暂无数据</div>
    <Masker :loading="loading" />
  </div>
</template>

<script>
import Masker from "@/components/mask/Masker";
import {
  deleteLikeByArticleIdAndUserId,
  queryLikesByArticleTypeAndUserId
} from "@/api/likes/likes";

export default {
  components: {
    Masker
  },
  methods: {
    toTitleDetail(id, type) {
      this.$router.push(`/${type}?id=${id}`);
    },
    async deleteArticle(id) {
      await deleteLikeByArticleIdAndUserId(id, this.$store.state.user.userId);
      alert("已删除");
      this.loading = true;
      const result = await queryLikesByArticleTypeAndUserId(
        this.$route.params.about,
        this.$store.state.user.userId
      );
      this.result = result.data;
      this.loading = false;
    }
  },
  data() {
    return {
      result: [],
      loading: false
    };
  },
  async mounted() {
    this.loading = true;
    const result = await queryLikesByArticleTypeAndUserId(
      this.$route.params.about,
      this.$store.state.user.userId
    );
    this.result = result.data;
    this.loading = false;
  },
  watch: {
    async $route() {
      this.loading = true;
      const result = await queryLikesByArticleTypeAndUserId(
        this.$route.params.about,
        this.$store.state.user.userId
      );
      this.result = result.data;
      this.loading = false;
    }
  }
};
</script>

<style>
#like {
  width: 80%;
  float: right;
}
</style>