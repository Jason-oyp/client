<template>
  <div
    id="detail-container"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <Nav />
    <div class="content-detail">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

        <el-breadcrumb-item
          :to="{path:'/articlelist/'+$route.params.about,query:{page:1,limit:10}}"
        >{{about}}</el-breadcrumb-item>
        <el-breadcrumb-item>文章详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="detail">
        <div class="title-box">
          <h2>{{content.title}}</h2>
          <span class="news-time">{{new Date(content.ctime).toLocaleDateString()}}</span>
          <span class="news-from">{{content.from}}</span>
          <el-button type="primary" size="small" :icon="islike" @click="changeStatus">{{favo}}</el-button>
        </div>
        <div class="content" v-html="content.content"></div>
      </div>
    </div>
    <Comment :commentData="commentData" :articleId="content.id" :getDatas="getDatas" />
    <Footer />
    <el-backtop target=".body" :bottom="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
        border-radius:50%;
        font-size:12px;
      }"
      >顶部</div>
    </el-backtop>
  </div>
</template>

<script>
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Comment from "@/components/comment";

import { queryArticleDetailById } from "@/api/articles/articles";
import { queryCommentByArticleId } from "@/api/comments/comments";
import {
  addLikeByUserId,
  deleteLikeByArticleIdAndUserId,
  queryLikesByArticleIdAndUserId
} from "@/api/likes/likes";
export default {
  components: {
    Nav,
    Footer,
    Comment
  },
  data() {
    return {
      about: "",
      content: "",
      loading: false,
      commentData: [],
      islike: "el-icon-star-off",
      favo: "收藏"
    };
  },
  async mounted() {
    this.loading = true;
    if (this.$route.params.about === "jyxd") {
      this.about = "经验心得";
    } else if (this.$route.params.about === "fszd") {
      this.about = "复试备考";
    } else if (this.$route.params.about === "english") {
      this.about = "英语";
    } else if (this.$route.params.about === "math") {
      this.about = "数学";
    } else if (this.$route.params.about === "politics") {
      this.about = "政治";
    } else if (this.$route.params.about === "profession") {
      this.about = "专业课";
    }
    this.getDatas();
  },
  methods: {
    async getDatas() {
      const result = await queryArticleDetailById(this.$route.query.id);
      if(result.length === 0){
        this.$router.replace('/error');
      }
      this.commentData = await queryCommentByArticleId(result.id);
      const like = await queryLikesByArticleIdAndUserId(
        result.id,
        this.$store.state.user.userId
      );
      if (like.data.length) {
        this.islike = "el-icon-star-on";
        this.favo = "已收藏";
      }
      this.content = result;
      this.loading = false;
    },
    async changeStatus() {
      if (this.islike === "el-icon-star-off") {
        await addLikeByUserId({
          title: this.content.title,
          text: this.content.text,
          like_time: new Date().toLocaleString(),
          article_id: this.content.id,
          user_id: this.$store.state.user.userId,
          type: this.$route.params.about
        });
        this.islike = "el-icon-star-on";
        this.favo = "已收藏";
      } else {
        await deleteLikeByArticleIdAndUserId(
          this.content.id,
          this.$store.state.user.userId
        );
        this.islike = "el-icon-star-off";
        this.favo = "收藏";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content-detail {
  margin: auto;
  padding-top: 20px;
  width: 80%;
  .detail {
    margin-bottom: 20px;
  }
  .title-box {
    position: relative;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    margin: 20px 0;
    span {
      color: #999;
    }
  }
  p {
    line-height: 30px;
  }
}
.news-time {
  margin-right: 10px;
}
.el-button--primary {
  float: right;
  margin-top: -2px;
}
.content-detail .el-button--primary span {
  color: white;
}
</style>