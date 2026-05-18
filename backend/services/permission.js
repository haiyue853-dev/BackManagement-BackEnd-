const profileService = require('./profile')
const authService = require('./auth')
const accountService = require('./account')

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
  getMenuListByRole(role = 'editor') {
    return role === 'admin' ? adminMenuList : editorMenuList
  }

  async getMenu(payload = {}) {
    const { username, password } = payload
    const authResult = await accountService.authenticate(username, password)

    if (!authResult) {
      return {
        success: false,
        code: 401,
        message: '用户名或密码错误'
      }
    }

    if (!authResult.success) {
      return authResult
    }

    const account = authResult.data
    const profile = await profileService.getCurrent(account.username)

    return {
      success: true,
      data: {
        menuList: this.getMenuListByRole(account.role),
        token: authService.issueToken({
          username: account.username,
          role: account.role
        }),
        userInfo: {
          username: account.username,
          role: profile.role,
          avatar: profile.avatar,
          signature: profile.signature,
          lastLoginTime: profile.lastLoginTime,
          lastLoginCity: profile.lastLoginCity
        }
      }
    }
  }

  async logout(token) {
    authService.revokeToken(token)
  }
}

module.exports = new PermissionService()
