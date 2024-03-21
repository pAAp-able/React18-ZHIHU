import * as TYPES from '../action-types'
import api from '../../api'

const storeAction = {
    //异步获取收藏列表，同步到redux中
    async queryStoreListAsync() {
        let list = null
        let { code, data } = await api.storeList()
        if (+code === 0) {
            list = data
        }
        return {
            type: TYPES.STORE_LIST,
            list: list
        }
    },
    //清空收藏列表
    clearStoreList() {
        return {
            type: TYPES.STORE_LIST,
            list: null
        }
    },
    //移除某一收藏
    removeStoreListById(id) {
        return {
            type: TYPES.STORE_REMOVE,
            id: id,
        }

    }
}

export default storeAction