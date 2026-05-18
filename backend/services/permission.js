const crypto = require('crypto')
const profileService = require('./profile')

const adminMenuList = [
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 'house',
    url: 'Home'
  },
  {
    path: '/mall',
    name: 'mall',
    label: '商品管理',
    icon: 'video-play',
    url: 'Mall'
  },
  {
    path: '/profile',
    name: 'profile',
    label: '个人中心',
    icon: 'avatar',
    url: 'Profile'
  },
  {
    path: '/user',
    name: 'user',
    label: '用户管理',
    icon: 'user',
    url: 'User'
  },
  {
    path: 'other',
    label: '其他',
    icon: 'location',
    children: [
      {
        path: '/page1',
        name: 'page1',
        label: '页面1',
        icon: 'setting',
        url: 'Page1'
      },
      {
        path: '/page2',
        name: 'page2',
        label: '页面2',
        icon: 'setting',
        url: 'Page2'
      }
    ]
  }
]

const editorMenuList = [
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 'house',
    url: 'Home'
  },
  {
    path: '/profile',
    name: 'profile',
    label: '个人中心',
    icon: 'avatar',
    url: 'Profile'
  },
  {
    path: '/user',
    name: 'user',
    label: '用户管理',
    icon: 'user',
    url: 'User'
  }
]

class PermissionService {
  async getMenu(payload = {}) {
    const { username, password } = payload

    if (username === 'admin' && password === 'admin') {
      const profile = await profileService.getCurrent()

      return {
        success: true,
        data: {
          menuList: adminMenuList,
          token: crypto.randomUUID(),
          userInfo: {
            username: 'admin',
            role: profile.role,
            avatar: profile.avatar,
            signature: profile.signature,
            lastLoginTime: profile.lastLoginTime,
            lastLoginCity: profile.lastLoginCity
          }
        }
      }
    }

    if (username === 'xiaoxiao' && password === 'xiaoxiao') {
      return {
        success: true,
        data: {
          menuList: editorMenuList,
          token: crypto.randomUUID(),
          userInfo: {
            username: 'xiaoxiao',
            role: '运营专员',
            avatar: 'user-default',
            signature: '持续迭代，交付稳定体验。',
            lastLoginTime: '2026-04-25 20:16:00',
            lastLoginCity: '广州'
          }
        }
      }
    }

    return {
      success: false,
      code: 401,
      message: '用户名或密码错误'
    }
  }
}

module.exports = new PermissionService()
