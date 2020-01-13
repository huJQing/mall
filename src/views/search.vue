<template>
  <div class="search">
    <top-bar></top-bar>
    <div class="goods-list-wrap" v-if="!showNoDataBox">
      <div class="goods-list-sort">
        <ul>
          <li
            v-for="(item,index) of sortList"
            :key="item.name"
            :class="{active:item.selected}"
            @click="sortChange(index)"
          >
            <p>{{item.name}}</p>
            <span class="dot" v-if="index != sortList.length-1"></span>
          </li>
        </ul>
      </div>

      <div class="goods-list">
        <el-card
          class="goods-item"
          v-for="(item,itemIndex) of goodsListData"
          :key="item.id"
          shadow="hover"
        >
          <div class="goods-img-wrap">
            <img v-lazy="item.goodsImg" class="goods-img" @click="gotoGoodsInfoPage(item)" />
          </div>
          <div class="goods-name" @click="gotoGoodsInfoPage(item)">{{item.goodsVersionName}}</div>
          <div class="goods-desc">{{item.simpleDesc}}</div>
          <div class="goods-color-list">
            <img
              v-for="version of item.goodsVersionInfo"
              :src="version.versionImg[0]"
              :key="version.color"
              class="goods-color-item"
              @mouseenter="changeGoodsImg(itemIndex,version)"
            />
          </div>
          <div class="goods-price">{{item.price}}元</div>
        </el-card>
      </div>

      <div class="goods-list-pagination-wrap" v-if="!showNoDataBox">
        <el-pagination
          class="goods-list-pagination"
          :page-size="pageSize"
          :pager-count="9"
          layout="prev, pager, next"
          :total="goodsListPaginationTotal"
          background
          @current-change="paginationChange"
        ></el-pagination>
      </div>
    </div>

    <div class="no-data-box" v-if="showNoDataBox">
      <div class="icon-wrap">
        <i class="el-icon-error"></i>
        <p>抱歉，没有搜索到与 “{{selectKey}}” 相关的商品</p>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar'
import { selectGoods } from '../request/api'

export default {
  name: 'search',
  props: ['selectKey'],
  components: { TopBar },
  data() {
    return {
      goodsListData: [], //商品数据
      goodsListPaginationTotal: 0, //商品总数
      pageIndex: 1, //页码数
      pageSize: 12, //页面商品数量
      showNoDataBox: false, //是否显现没有搜索到数据的提示
      sortList: [
        {
          name: '综合排序',
          sortKey: 'default',
          selected: true
        },
        {
          name: '价格高到低',
          sortKey: 'priceDesc',
          selected: false
        },
        {
          name: '价格低到高',
          sortKey: 'priceAsc',
          selected: false
        },
      ],
      selectedSortKey: 'default'
    }
  },
  methods: {
    //排序方式改变时的回调函数
    sortChange(index) {
      if (this.sortList[index].sortKey != this.selectedSortKey) {
        this.sortList.forEach((item, i) => {
          item.selected = index == i ? true : false
        })
        this.selectedSortKey = this.sortList[index].sortKey
        this.selectGoods()
      }
    },
    //页码改变时的回调函数
    paginationChange(index) {
      this.pageIndex = index
      this.selectGoods()
      window.scrollTo(0, 0);
    },
    //获取商品列表
    selectGoods() {
      window.console.log(this.selectedSortKey)
      selectGoods({
        selectKey: this.selectKey,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortKey: this.selectedSortKey
      }).then(res => {
        let data = res.data
        if (res.code == 200 && data.length > 0) {
          data.forEach(item => {
            item.goodsImg = item.goodsVersionInfo[0].versionImg[0]
            item.goodsVersionName = item.goodsName + ' ' + item.goodsVersionInfo[0].color
          })
          this.goodsListPaginationTotal = res.total
          this.goodsListData = data
          window.console.log(this.goodsListPaginationTotal)
        } else {
          this.showNoDataBox = true
        }
      })
    },
    //鼠标移入时改变当前显示的商品图片
    changeGoodsImg(index, version) {
      let goodsListData = this.goodsListData
      goodsListData[index].goodsImg = version.versionImg[0]
      goodsListData[index].goodsVersionName = goodsListData[index].goodsName + ' ' + version.color
      this.goodsListData = goodsListData
    },
    gotoGoodsInfoPage(item) {
      window.open('#/goodsInfo/' + item.id, '_blank');
      //router.push('/goodsInfo/' + item.id)
    }
  },
  mounted() {
    window.console.log(this.selectKey)
    this.selectGoods()
  }
}
</script>

<style lang="scss">
.search {
  .goods-list-wrap {
    width: 75em;
    margin: 0 auto;

    .goods-list-sort {
      margin-top: 2em;
      overflow: hidden;
      ul {
        font-size: 0.875em;
        color: #999;
        li {
          display: block;
          float: left;
          cursor: pointer;
          p {
            float: left;
          }
          .dot {
            float: left;
            height: 3px;
            width: 3px;
            border-radius: 50%;
            background: #999;
            margin: 0.65em 1.25em;
          }
        }
        .active {
          color: $emTetxColor;
        }
      }
    }

    .goods-list {
      width: 100%;
      .goods-item {
        width: 18em;
        height: 25em;
        margin-right: 1em;
        background-color: #ffffff;
        float: left;
        margin-top: 2em;
        border: none;
        border-radius: 0;
        .goods-img-wrap {
          width: 13em;
          height: 13em;
          margin: 0 auto;
          margin-bottom: 10px;
          .goods-img {
            width: 13em;
            height: 13em;
            cursor: pointer;
          }
        }
        .goods-name {
          text-align: center;
          overflow: hidden; /*超出隐藏*/
          white-space: nowrap; /*强制在同一行显示*/
          text-overflow: ellipsis; /*省略号*/
          margin-bottom: 5px;
          cursor: pointer;
        }
        .goods-desc {
          text-align: center;
          font-size: 0.75em;
          color: #999;
          margin-bottom: 15px;
        }
        .goods-color-list {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
          .goods-color-item {
            width: 2.2em;
            height: 2.2em;
            border: 1px solid #ddd;
            margin-right: 10px;
            cursor: pointer;
            &:hover {
              border: 1px solid #409eff;
            }
            &:last-child {
              margin-right: 0px;
            }
          }
        }
        .goods-price {
          text-align: center;
          color: $emTetxColor;
          font-weight: bold;
        }
      }
      .goods-item:nth-child(4n + 4) {
        margin-right: 0;
      }
    }
    .goods-list-pagination-wrap {
      clear: both;
      width: 75em;
      height: 8em;
      margin: 0 auto;
      position: relative;
      .goods-list-pagination {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .no-data-box {
    width: 75em;
    margin: 0 auto;
    padding: 20px;
    min-height: 10em;
    margin-top: 30px;
    .icon-wrap {
      text-align: center;
      i {
        color: #d44d44;
        font-size: 6em;
        padding-bottom: 2rem;
      }
      p {
        font-size: 1.5em;
        font-weight: bold;
      }
    }
  }

  //修改elementUI分页器的部分样式
  .btn-prev i,
  .btn-next i {
    font-size: 20px !important;
    color: #999 !important;
    font-weight: 200 !important;
  }
  .el-pager {
    li {
      font-size: 20px;
      color: #999 !important;
      font-weight: 200 !important;
      margin: 0 8px !important;
      &:hover {
        color: #409eff !important;
      }
    }
    .active {
      color: #ffffff !important;
    }
  }
}
</style>