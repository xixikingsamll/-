# PolygonGame

基于动态规划实现的多边形游戏网页，采用原生三件套实现。

Html + CSS + JavaScript + Bootstrap

### 1. 游戏规则

1. 初始设置
   - 游戏开始时，有一个由n个顶点构成的多边形。
   - 每个顶点被赋予一个整数值。
   - 每条边被赋予一个运算符“+”或“*”。
   - 所有边依次用整数从1到n编号。
2. 游戏步骤
   - **第一步**：删除一条边。
   - 随后n-1步
     - 选择一条边E以及由E连接着的两个顶点V1和V2。
     - 用一个新的顶点取代边E以及由E连接着的两个顶点V1和V2。新顶点的值为V1和V2的整数值通过边E上的运算符运算得到的结果。
3. 游戏结束
   - 当所有边都被删除时，游戏结束。
4. 得分计算
   - 游戏的得分是最后剩下的那个顶点上的整数值。



### 2. 主界面

![image-20240623225156243](C:\Users\86180\AppData\Roaming\Typora\typora-user-images\image-20240623225156243.png)

允许用户手动或者随机生成节点，右边的栏目可以对边进行操作，同时计算得分，也可以调用算法获取最优和最差的结果



### 3. 操作步骤

直接运行html文件即可



### 4. 未实现功能

- 注册登录
- 游戏记录
- 个人主页

