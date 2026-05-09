# 母亲节可分享专属信封 H5

这是一个可以直接上传到 GitHub Pages 的静态网页项目。

## 功能

- 可爱手绘贴纸风页面
- 白色信封从屏幕中间飞入的开场动画
- 点击信封打开信纸
- 打字机效果：文字一行一行出现
- 爱心漂浮动画
- 花瓣/落花飘落效果
- 打开信封时撒花
- 输入妈妈称呼、祝福语、落款，自动生成专属信
- 一键复制祝福语
- 生成专属链接参数版

## 项目结构

```text
mothers-day-envelope-h5/
├─ index.html
├─ README.md
├─ .nojekyll
└─ assets/
   ├─ style.css
   ├─ script.js
   └─ music.README.txt
```

## 背景音乐

因为音乐涉及版权，压缩包里没有附带真实音乐文件。

你可以自己准备一首 mp3，改名为：

```text
music.mp3
```

然后放到：

```text
assets/music.mp3
```

微信里通常不能自动播放音乐，用户第一次点击页面或点击信封后，浏览器才允许播放。代码里已经做了兼容处理。

## 专属链接写法

上传成功后，假设你的网站地址是：

```text
https://你的用户名.github.io/mothers-day-envelope-h5/
```

那么可以这样生成专属链接：

```text
https://你的用户名.github.io/mothers-day-envelope-h5/?name=妈妈&msg=母亲节快乐！谢谢您一直以来的爱。&from=爱您的孩子
```

页面打开后会自动读取：

- `name`：妈妈称呼
- `msg`：祝福语正文
- `from`：落款

也可以直接在页面里输入内容，然后点击「生成专属链接」。

## 上传到 GitHub Pages

1. 新建一个 GitHub 仓库，例如：`mothers-day-envelope-h5`
2. 把 `index.html`、`README.md`、`.nojekyll`、`assets` 文件夹全部上传
3. 进入仓库 Settings
4. 找到 Pages
5. Source 选择 `Deploy from a branch`
6. Branch 选择 `main`，目录选择 `/root`
7. 保存后等待 1 到 3 分钟
8. 得到类似这样的链接：

```text
https://你的用户名.github.io/mothers-day-envelope-h5/
```

复制这个链接发到微信，对方点击后即可打开。

## 修改默认文字

打开 `assets/script.js`，找到：

```js
const defaultData = {
  name: '妈妈',
  msg: '母亲节快乐！...',
  from: '爱您的我'
};
```

把里面的默认文字改成你自己的内容即可。


## 纯信封专属链接说明

现在点击页面里的“生成专属链接”后，链接会自动带上 `mode=share` 参数：

```text
https://你的用户名.github.io/你的仓库名/?mode=share&name=妈妈&msg=母亲节快乐&from=爱您的孩子
```

别人从微信打开这个链接时，会进入“纯展示模式”：

- 不显示上方可编辑输入框
- 不显示生成链接区域
- 只保留母亲节标题、动态信封、打字机文字、花瓣/爱心动画和音乐按钮

如果你自己要编辑内容，请打开不带参数的主页：

```text
https://你的用户名.github.io/你的仓库名/
```
