---
title: 编程语言代码示例
tags: [编程, 代码, JavaScript, Python, CSS, 示例]
createdAt: 2023-12-01T09:00:00Z
summary: 多种编程语言的代码示例，用于展示山水卡片系统的代码高亮功能。
---

# 编程语言代码示例

这张卡片包含了不同编程语言的代码示例，用于展示山水卡片系统的代码高亮功能。

## JavaScript 示例

JavaScript是一种高级解释型编程语言，是网页交互的核心技术之一。

```javascript
// 函数式编程示例
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers
  .filter(n => n % 2 === 0)  // 获取偶数
  .map(n => n * 2);          // 将每个数乘以2

console.log(doubled);        // [4, 8]

// 面向对象示例
class Mountain {
  constructor(name, height) {
    this.name = name;
    this.height = height;
  }
  
  describe() {
    return `${this.name}山高达${this.height}米`;
  }
  
  static compareHeight(a, b) {
    return a.height - b.height;
  }
}

const mountains = [
  new Mountain('泰山', 1545),
  new Mountain('黄山', 1864),
  new Mountain('华山', 2154)
];

// 按高度排序
mountains.sort(Mountain.compareHeight);
console.log(mountains[0].describe());
```

## Python 示例

Python是一种简洁易读的高级编程语言，非常适合初学者，同时也被专业开发者广泛使用。

```python
# 数据分析示例
import pandas as pd
import matplotlib.pyplot as plt

# 创建示例数据
data = {
    '山名': ['泰山', '黄山', '华山', '峨眉山', '庐山'],
    '高度(米)': [1545, 1864, 2154, 3099, 1474],
    '游客数(万人/年)': [286, 329, 251, 185, 213]
}

# 创建DataFrame
df = pd.DataFrame(data)
print(df.describe())

# 简单绘图
plt.figure(figsize=(10, 6))
plt.bar(df['山名'], df['高度(米)'], color='forestgreen')
plt.title('中国著名山峰高度比较')
plt.xlabel('山名')
plt.ylabel('高度(米)')
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()

# 函数定义
def calculate_density(visitors, area):
    """计算每平方公里的游客密度"""
    return visitors * 10000 / area  # 转换为每平方公里人数

density = calculate_density(df['游客数(万人/年)'], 100)  # 假设每座山景区面积为100平方公里
print(f"平均游客密度: {density.mean():.2f} 人/平方公里")
```

## CSS 示例

CSS是一种设计语言，用于为网页添加样式和布局。

```css
/* 山水主题样式 */
:root {
    --ink-light: #7a8b8c;
    --ink-medium: #48625c;
    --ink-dark: #324443;
    --paper-light: #f6f2e9;
    --mountain-green: #59814c;
    --water-blue: #a0e8fd;
    --mountain-gray: #999996;
    --accent-orange: #d99156;
    --shadow-subtle: 0 2px 10px rgba(0, 0, 0, 0.08);
    --font-main: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.card {
    background-color: var(--paper-light);
    border-radius: 8px;
    padding: 2rem;
    box-shadow: var(--shadow-subtle);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-out;
}

.card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, var(--mountain-green), var(--water-blue));
    opacity: 0.8;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

@media (max-width: 768px) {
    .card {
        padding: 1.5rem;
    }
    
    .card-grid {
        grid-template-columns: 1fr;
    }
}
```

## HTML 示例

HTML是网页的标准标记语言，定义了网页的结构和内容。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>山水卡片</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>山水卡片学习系统</h1>
        <nav>
            <ul>
                <li><a href="#">首页</a></li>
                <li><a href="#">所有卡片</a></li>
                <li><a href="#">关于系统</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section class="card-container">
            <article class="card">
                <header>
                    <h2>泰山游记</h2>
                    <div class="meta">
                        <time datetime="2023-05-15">2023年5月15日</time>
                        <span class="tag">旅行</span>
                        <span class="tag">山水</span>
                    </div>
                </header>
                <div class="content">
                    <p>五岳之首，气势磅礴...</p>
                    <a href="#" class="read-more">阅读更多</a>
                </div>
            </article>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2023 山水卡片学习系统</p>
    </footer>
</body>
</html>
```

## SQL 示例

SQL是一种用于管理和查询关系型数据库的语言。

```sql
-- 创建山水数据库表
CREATE TABLE mountains (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    height FLOAT NOT NULL,
    location VARCHAR(100),
    first_climbed DATE,
    description TEXT
);

-- 插入数据
INSERT INTO mountains (name, height, location, first_climbed, description) 
VALUES 
('泰山', 1545, '山东省泰安市', '公元前219年', '五岳之首，被誉为天下第一山'),
('黄山', 1864, '安徽省黄山市', '公元747年', '奇松、怪石、云海、温泉四绝'),
('华山', 2154, '陕西省华阴市', '西汉', '西岳华山，中国五岳之一，素有太华之称'),
('峨眉山', 3099, '四川省峨眉山市', '东汉', '四大佛教名山之一，以雄、秀、神、奇、灵著称'),
('庐山', 1474, '江西省九江市', '三国时期', '集雄、奇、险、秀于一体的山岳风景名胜');

-- 查询超过2000米的山峰
SELECT name, height, location 
FROM mountains 
WHERE height > 2000 
ORDER BY height DESC;

-- 按地区统计平均高度
SELECT 
    SUBSTR(location, 1, 2) AS province,
    COUNT(*) AS mountain_count,
    AVG(height) AS avg_height,
    MAX(height) AS max_height
FROM mountains
GROUP BY SUBSTR(location, 1, 2)
HAVING COUNT(*) > 0
ORDER BY avg_height DESC;
```

## JSON 示例

JSON是一种轻量级的数据交换格式，易于人阅读和编写，也易于机器解析和生成。

```json
{
  "mountain_collection": {
    "name": "中国著名山脉数据",
    "created": "2023-12-01",
    "author": "山水卡片系统",
    "mountains": [
      {
        "id": 1,
        "name": "泰山",
        "height": 1545,
        "location": {
          "province": "山东",
          "city": "泰安",
          "coordinates": {
            "latitude": 36.2543,
            "longitude": 117.1007
          }
        },
        "features": ["五岳之首", "气势磅礴", "文化遗产"],
        "bestVisitingMonths": [4, 5, 9, 10],
        "UNESCO": true
      },
      {
        "id": 2,
        "name": "黄山",
        "height": 1864,
        "location": {
          "province": "安徽",
          "city": "黄山",
          "coordinates": {
            "latitude": 30.1333,
            "longitude": 118.1667
          }
        },
        "features": ["奇松", "怪石", "云海", "温泉"],
        "bestVisitingMonths": [3, 4, 9, 10, 11],
        "UNESCO": true
      }
    ]
  }
}
```

## Bash 示例

Bash是Unix shell和命令语言，是许多Linux发行版的默认shell。

```bash
#!/bin/bash

# 山水数据处理脚本

echo "开始处理山水数据..."

# 定义山峰数组
mountains=("泰山:1545" "黄山:1864" "华山:2154" "峨眉山:3099" "庐山:1474")

# 创建输出目录
mkdir -p output/mountains

# 处理每座山的数据
for mountain in "${mountains[@]}"; do
    # 使用:分割山名和高度
    name=$(echo $mountain | cut -d: -f1)
    height=$(echo $mountain | cut -d: -f2)
    
    echo "处理 $name 数据，高度: $height 米"
    
    # 创建每座山的目录
    mkdir -p "output/mountains/$name"
    
    # 生成简单的数据文件
    cat > "output/mountains/$name/info.txt" << EOF
山名: $name
高度: $height 米
数据生成时间: $(date)
EOF

    # 简单数据分析
    if [ $height -gt 2000 ]; then
        echo "$name 是高海拔山峰" >> "output/mountains/$name/analysis.txt"
    else
        echo "$name 是中低海拔山峰" >> "output/mountains/$name/analysis.txt"
    fi
done

# 生成汇总报告
echo "生成汇总报告..."

# 查找最高的山
highest_mountain=""
highest_height=0

for mountain in "${mountains[@]}"; do
    name=$(echo $mountain | cut -d: -f1)
    height=$(echo $mountain | cut -d: -f2)
    
    if [ $height -gt $highest_height ]; then
        highest_mountain=$name
        highest_height=$height
    fi
done

echo "数据处理完成！"
echo "最高的山是 $highest_mountain，高度 $highest_height 米"

# 退出脚本
exit 0
```

这些代码示例展示了山水卡片系统对不同编程语言的代码高亮能力。当你需要记录和分享代码片段时，良好的语法高亮可以提高可读性和理解力。 