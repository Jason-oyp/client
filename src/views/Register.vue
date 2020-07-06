<template>
  <div id="register-fixed">
    <div id="register-container">
      <h3>请注册</h3>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <div class="gender">
          <el-radio v-model="gender" label="0">男</el-radio>
          <el-radio v-model="gender" label="1">女</el-radio>
        </div>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="to-login">
        已有账号？
        <router-link to="/login">去登录</router-link>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error("姓名不能为空"));
      }
      setTimeout(() => {
        if (value.length < 5) {
          callback(new Error("姓名必须大于5个字符"));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkPhone = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("电话号码有误"));
        } else {
          callback();
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        name: "",
        phone: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        name: [{ validator: checkName, trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }]
      },
      gender: "0"
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    register() {
      this.$ajax({
        method: "post",
        url: "api/register",
        data: {
          username: this.ruleForm.name,
          password: this.ruleForm.pass,
          gender: this.gender,
          phone: this.ruleForm.phone
        }
      }).then(
        res => {
          if (res.status == 200) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("username", res.data.username);
            localStorage.setItem("_id", res.data.id);
            this.$store.commit("user/setUsername", res.data.username);
            this.$store.commit("user/setUserId", res.data.id);
            this.$showMessage(res.message, "success");
            this.$router.push("/");
          } else {
            this.$showMessage(res.message, "error");
          }
        },
        err => {
          this.$showMessage("服务器错误", "error");
        }
      );
    }
  }
};
</script>

<style lang="less">
#register-fixed {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgb(201, 234, 238);
}
#register-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 400px;
  height: 365px;
  .to-login {
    position: absolute;
    width: 135px;
    height: 20px;
    right: 0px;
    bottom: 15px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
  h3 {
    text-align: center;
    height: 35px;
  }
}
.gender {
  padding-left: 100px;
  margin-bottom: 20px;
}
</style>
