const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('.'));

// 转换材料数据格式
function transformMaterial(material) {
  return {
    id: material.id,
    name: material.name,
    category: material.category,
    categoryName: material.category_name || material.categoryName,
    brand: material.brand,
    brandName: material.brand_name || material.brandName,
    style: material.style,
    price: material.price,
    stock: material.stock,
    unit: material.unit,
    spec: material.spec,
    image: material.image,
    description: material.description,
    is_featured: material.is_featured,
    is_new: material.is_new,
    sort_order: material.sort_order,
    status: material.status,
    created_at: material.created_at,
    updated_at: material.updated_at
  };
}

// 转换作品集数据格式
function transformPortfolio(portfolio) {
  return {
    id: portfolio.id,
    name: portfolio.name,
    style: portfolio.style,
    type: portfolio.type,
    vrLink: portfolio.vr_link || portfolio.vrLink || '',
    image: portfolio.image,
    description: portfolio.description,
    recommended: portfolio.recommended || false,
    category: portfolio.category || '',
    sort_order: portfolio.sort_order || 0,
    status: portfolio.status || 'active',
    created_at: portfolio.created_at,
    updated_at: portfolio.updated_at
  };
}

// 获取所有材料
app.get('/api/materials', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM materials');
    const transformedResults = results.map(transformMaterial);
    res.json(transformedResults);
  } catch (error) {
    console.error('Error getting materials:', error);
    res.status(500).json({ error: 'Failed to get materials' });
  }
});

// 获取单个材料
app.get('/api/materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query('SELECT * FROM materials WHERE id = ?', [id]);
    if (results.length === 0) {
      res.status(404).json({ error: 'Material not found' });
    } else {
      const transformedMaterial = transformMaterial(results[0]);
      res.json(transformedMaterial);
    }
  } catch (error) {
    console.error('Error getting material:', error);
    res.status(500).json({ error: 'Failed to get material' });
  }
});

// 添加材料
app.post('/api/materials', async (req, res) => {
  try {
    const { name, category, categoryName, brand, brandName, style, price, stock, unit, spec, image, description } = req.body;
    const results = await db.query(
      'INSERT INTO materials (name, category, category_name, brand, brand_name, style, price, stock, unit, spec, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, categoryName, brand, brandName, style, price, stock, unit, spec, image, description]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
  } catch (error) {
    console.error('Error adding material:', error);
    res.status(500).json({ error: 'Failed to add material' });
  }
});

// 更新材料
app.put('/api/materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, categoryName, brand, brandName, style, price, stock, unit, spec, image, description } = req.body;
    const results = await db.query(
      'UPDATE materials SET name = ?, category = ?, category_name = ?, brand = ?, brand_name = ?, style = ?, price = ?, stock = ?, unit = ?, spec = ?, image = ?, description = ? WHERE id = ?',
      [name, category, categoryName, brand, brandName, style, price, stock, unit, spec, image, description, id]
    );
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Material not found' });
    } else {
      res.json({ id, ...req.body });
    }
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ error: 'Failed to update material' });
  }
});

// 删除材料
app.delete('/api/materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query('DELETE FROM materials WHERE id = ?', [id]);
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Material not found' });
    } else {
      res.json({ message: 'Material deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

// 获取所有作品集
app.get('/api/portfolios', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM portfolios');
    const transformedResults = results.map(transformPortfolio);
    res.json(transformedResults);
  } catch (error) {
    console.error('Error getting portfolios:', error);
    res.status(500).json({ error: 'Failed to get portfolios' });
  }
});

// 获取单个作品集
app.get('/api/portfolios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query('SELECT * FROM portfolios WHERE id = ?', [id]);
    if (results.length === 0) {
      res.status(404).json({ error: 'Portfolio not found' });
    } else {
      const transformedPortfolio = transformPortfolio(results[0]);
      res.json(transformedPortfolio);
    }
  } catch (error) {
    console.error('Error getting portfolio:', error);
    res.status(500).json({ error: 'Failed to get portfolio' });
  }
});

// 添加作品集
app.post('/api/portfolios', async (req, res) => {
  try {
    const { name, style, type, vrLink, image, description, recommended, category } = req.body;
    const results = await db.query(
      'INSERT INTO portfolios (name, style, type, vr_link, image, description, recommended, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, style, type, vrLink, image, description, recommended, category]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
  } catch (error) {
    console.error('Error adding portfolio:', error);
    res.status(500).json({ error: 'Failed to add portfolio' });
  }
});

// 更新作品集
app.put('/api/portfolios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, style, type, vrLink, image, description, recommended, category } = req.body;
    const results = await db.query(
      'UPDATE portfolios SET name = ?, style = ?, type = ?, vr_link = ?, image = ?, description = ?, recommended = ?, category = ? WHERE id = ?',
      [name, style, type, vrLink, image, description, recommended, category, id]
    );
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Portfolio not found' });
    } else {
      res.json({ id, ...req.body });
    }
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// 删除作品集
app.delete('/api/portfolios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query('DELETE FROM portfolios WHERE id = ?', [id]);
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Portfolio not found' });
    } else {
      res.json({ message: 'Portfolio deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});