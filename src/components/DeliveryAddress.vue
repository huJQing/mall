<template>
  <div id="delivery-address">
    <div class="address-list" v-loading="showLoading">
      <el-card :body-style="{ padding: '0px' }" shadow="hover" class="add-address-item">
        <div class="add-tips-wrap" @click="addressFormVisible = true">
          <div class="add-tips">
            <i class="el-icon-circle-plus"></i>
            <p>添加新地址</p>
          </div>
        </div>
      </el-card>
      <el-card
        :body-style="{ padding: '0px' }"
        v-for="(item, index) of addressList"
        :key="item.id"
        shadow="hover"
        class="address-item"
        :class="{ 'address-selected': item.selected && canSelect }"
        @click.native="selectedAddressHandel(index)"
      >
        <div class="address-info">
          <i class="el-icon-check selected-icon" v-if="item.selected && canSelect"></i>
          <p class="name">{{ item.name }}</p>
          <p class="phone">{{ item.phone }}</p>
          <p class="about-address">
            <span class="item">{{ item.province }}</span>
            <span class="item">{{ item.city }}</span>
            <span class="item">{{ item.area }}</span>
          </p>
          <p class="detailed-address">{{ item.detailedAddress }}</p>
        </div>
        <div class="address-action">
          <span @click="editAddress(item)">修改</span>
          <span v-if="canDelete" @click="deleteAddress(item.id)">删除</span>
        </div>
      </el-card>
    </div>

    <!--添加/修改收货地址弹出框-->
    <el-dialog
      title="收货地址"
      :visible.sync="addressFormVisible"
      width="600px"
      @close="clearFormData('addressFormmRef')"
    >
      <el-form :model="addressForm" ref="addressFormmRef" :rules="addressFormRules">
        <el-form-item label="姓名" label-width="80px" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>

        <el-form-item label="手机号" label-width="80px" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入收货人手机号"></el-input>
        </el-form-item>

        <el-form-item label="省/市/区" label-width="80px" prop="area">
          <el-cascader
            v-model="addressForm.area"
            :options="areaList"
            :props="{ label: 'name', value: 'code' }"
            filterable
            clearable
            separator="  "
            style="display: block;"
            placeholder="请输入或选择省/市/区"
            ref="addressCascaderRef"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" label-width="80px" prop="detailedAddress">
          <el-input
            type="textarea"
            :rows="2"
            v-model="addressForm.detailedAddress"
            placeholder="请输入详细地址"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="isEditAddress ? updateAddressForm() : submitAddressForm()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllAddress, getAreaData, addAddress, deleteAddress, updateAddress } from "../request/api"

/*props:
 * canDelete       是否可以进行删除操作
 * canSelect       是否可以进行选择操作
 *
 * emit:
 * onSelect(value)  地址选中后的回调,value为地址的详细数据
 *
 */
export default {
  name: "DeliveryAddress",
  inject: ["reload"],
  props: {
    //是否显示删除按钮
    canDelete: {
      type: Boolean,
      default: false
    },
    //是否开启选中功能
    canSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error("请输入正确的手机号"))
        }
      }
    }
    return {
      addressList: [], //收货地址列表
      showLoading: true, //是否显示加载状态
      areaList: [], //区域list

      //添加/修改收货地址表单相关数据
      addressFormVisible: false,
      isEditAddress: false, //是否是编辑模式
      eidtAddressId: 0, //当前编辑地址的id
      addressForm: {
        name: "",
        phone: "",
        area: {},
        detailedAddress: ""
      },
      addressFormRules: {
        name: [
          { required: true, message: "请输入收货人名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符之间", trigger: "change" }
        ],
        phone: [
          { required: true, message: "请输入收货人手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        area: [{ required: true, message: "请选择或输入省市区" }],
        detailedAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { min: 5, max: 32, message: "长度在 5 到 32 个字符之间", trigger: "change" }
        ]
      }
    }
  },
  methods: {
    //传入ref名，清空对应表单数据
    clearFormData(formRefName) {
      this.isEditAddress = false
      this.eidtAddressId = 0
      this.$refs[formRefName].resetFields()
    },
    //重载页面
    reloadPage() {
      setTimeout(() => {
        this.reload()
      }, 1000)
    },
    //选中收货地址回调
    selectedAddressHandel(index) {
      if (this.canSelect) {
        let selectItem = {}
        this.addressList.forEach((item, i) => {
          item.selected = i === index ? true : false
          selectItem = item
        })
        this.$emit("onSelect", selectItem)
      } else {
        return
      }
    },
    //修改收货地址
    editAddress(item) {
      this.isEditAddress = true
      this.addressFormVisible = true
      this.eidtAddressId = item.id
      this.$nextTick(() => {
        this.addressForm = {
          name: item.name,
          phone: item.phone,
          area: [item.provinceCode, item.cityCode, item.areaCode],
          detailedAddress: item.detailedAddress
        }
      })
    },
    //删除收货地址
    deleteAddress(id) {
      this.$confirm("确认删除该收货地址吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return deleteAddress({
            addressItemId: id
          })
        })
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("删除收货地址成功！")
            this.reloadPage()
          } else {
            this.$message.success("删除收货地址失败！")
          }
        })
    },
    //更新收货地址表单
    updateAddressForm() {
      this.$refs["addressFormmRef"].validate((valid) => {
        if (valid) {
          //获取当前选中的省，市，区
          let areaData = []
          let pathNodes = this.$refs.addressCascaderRef.getCheckedNodes()[0].pathNodes
          pathNodes.forEach((item) => {
            areaData.push({ code: item.value, name: item.label })
          })
          let addressForm = this.addressForm
          updateAddress({
            id: this.eidtAddressId,
            name: addressForm.name,
            phone: addressForm.phone,
            province: areaData[0].name,
            provinceCode: areaData[0].code,
            city: areaData[1].name,
            cityCode: areaData[1].code,
            area: areaData[2].name,
            areaCode: areaData[2].code,
            detailedAddress: addressForm.detailedAddress
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success("收货地址更新成功！")
              this.addressFormVisible = false
              this.reloadPage()
            } else {
              this.$message.error("收货地址更新失败！")
            }
          })
        } else {
          return false
        }
      })
    },
    //提交收货地址表单
    submitAddressForm() {
      this.$refs["addressFormmRef"].validate((valid) => {
        if (valid) {
          //获取当前选中的省，市，区
          let areaData = []
          let pathNodes = this.$refs.addressCascaderRef.getCheckedNodes()[0].pathNodes
          pathNodes.forEach((item) => {
            areaData.push({ code: item.value, name: item.label })
          })
          let addressForm = this.addressForm
          addAddress({
            name: addressForm.name,
            phone: addressForm.phone,
            province: areaData[0].name,
            provinceCode: areaData[0].code,
            city: areaData[1].name,
            cityCode: areaData[1].code,
            area: areaData[2].name,
            areaCode: areaData[2].code,
            detailedAddress: addressForm.detailedAddress
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success("收货地址添加成功！")
              this.addressFormVisible = false
              this.reloadPage()
            } else {
              this.$message.error("收货地址添加失败！")
            }
          })

          window.console.log(areaData)
        } else {
          return false
        }
      })
    },
    //获取所有省份
    getAreaData() {
      getAreaData().then((res) => {
        if (res.code === 200) {
          window.console.log(res)
          this.areaList = res.data
        }
      })
    },
    //获取所有收货地址
    getAllAddress() {
      this.showLoading = true
      getAllAddress()
        .then((res) => {
          window.console.log(res)
          if (res.code === 200) {
            this.addressList = res.data.map((item) => {
              return Object.assign(item, { selected: false })
            })
            if (this.canSelect) {
              this.addressList[0].selected = true
              this.$emit("onSelect", this.addressList[0])
            }
            window.console.log(this.addressList)
          } else {
            this.addressList = []
          }
        })
        .finally(() => {
          this.showLoading = false
        })
    }
  },
  mounted() {
    this.getAllAddress()
    this.getAreaData()
  }
}
</script>

<style lang="scss" scoped>
#delivery-address {
  width: 100%;
  .address-list {
    overflow: hidden;
    padding: 1em;
    display: flex;
    flex-wrap: wrap;
    .add-address-item {
      width: 32%;
      height: 11em;
      margin-top: 1em;
      margin-right: calc(2% - 3px);
      border-radius: 0;
      cursor: pointer;
      position: relative;
      &:hover {
        border: 1px solid #aaa;
        .add-tips {
          color: #757575;
        }
      }
      .add-tips-wrap {
        height: 11em;
        .add-tips {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #cccccc;
          text-align: center;
          transition: color 0.2s linear;
          i {
            font-size: 2em;
          }
        }
      }
    }

    .address-selected {
      border: 1px solid $emTetxColor;
      &:hover {
        border: 1px solid $emTetxColor !important;
      }
    }
    .address-item {
      width: 27%;
      margin-top: 1em;
      margin-right: calc(2% - 3px);
      border-radius: 0;
      height: 9em;
      position: relative;
      cursor: pointer;
      padding: 1em 2.5%;
      &:hover {
        border: 1px solid #aaa;
        .address-action {
          display: block;
        }
      }
      .address-info {
        .selected-icon {
          font-size: 1.5em;
          font-weight: 800;
          color: $emTetxColor;
          position: absolute;
          top: 0.8em;
          right: 0.8em;
        }
        .name {
          font-size: 1.25em;
          margin-bottom: 0.5em;
        }
        .phone,
        .about-address,
        .detailed-address {
          color: #757575;
          font-size: 0.875em;
        }
        .about-address {
          overflow: hidden; /*超出隐藏*/
          white-space: nowrap; /*强制在同一行显示*/
          text-overflow: ellipsis; /*省略号*/
          .item {
            margin-right: 0.35em;
          }
        }
      }
      .address-action {
        position: absolute;
        bottom: 1em;
        right: 1.5em;
        display: none;
        span {
          font-size: 0.875em;
          color: $emTetxColor;
          margin-left: 1em;
        }
      }
      &:nth-child(3n + 1) {
        margin-right: 0;
      }
    }
  }
}
</style>
