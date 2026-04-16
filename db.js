const fs = require('fs');
const path = require('path');

// 数据文件路径
const materialsFile = path.join(__dirname, 'materials.json');
const portfoliosFile = path.join(__dirname, 'portfolio.json');

// 读取材料数据
function readMaterials() {
  try {
    if (fs.existsSync(materialsFile)) {
      const data = fs.readFileSync(materialsFile, 'utf8');
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (error) {
    console.error('读取材料数据失败:', error);
    return [];
  }
}

// 写入材料数据
function writeMaterials(materials) {
  try {
    fs.writeFileSync(materialsFile, JSON.stringify(materials, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('写入材料数据失败:', error);
    return false;
  }
}

// 读取作品集数据
function readPortfolios() {
  try {
    if (fs.existsSync(portfoliosFile)) {
      const data = fs.readFileSync(portfoliosFile, 'utf8');
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (error) {
    console.error('读取作品集数据失败:', error);
    return [];
  }
}

// 写入作品集数据
function writePortfolios(portfolios) {
  try {
    fs.writeFileSync(portfoliosFile, JSON.stringify(portfolios, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('写入作品集数据失败:', error);
    return false;
  }
}

// 获取所有材料
function getMaterials() {
  return new Promise((resolve) => {
    const materials = readMaterials();
    resolve(materials);
  });
}

// 获取单个材料
function getMaterialById(id) {
  return new Promise((resolve) => {
    const materials = readMaterials();
    const material = materials.find(m => m.id == id);
    resolve(material ? [material] : []);
  });
}

// 添加材料
function addMaterial(material) {
  return new Promise((resolve) => {
    const materials = readMaterials();
    const newId = materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1;
    const newMaterial = {
      id: newId,
      ...material,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    materials.push(newMaterial);
    const success = writeMaterials(materials);
    if (success) {
      resolve({ insertId: newId });
    } else {
      throw new Error('添加材料失败');
    }
  });
}

// 更新材料
function updateMaterial(id, material) {
  return new Promise((resolve) => {
    const materials = readMaterials();
    const index = materials.findIndex(m => m.id == id);
    if (index === -1) {
      resolve({ affectedRows: 0 });
    } else {
      materials[index] = {
        ...materials[index],
        ...material,
        updated_at: new Date().toISOString()
      };
      const success = writeMaterials(materials);
      if (success) {
        resolve({ affectedRows: 1 });
      } else {
        throw new Error('更新材料失败');
      }
    }
  });
}

// 删除材料
function deleteMaterial(id) {
  return new Promise((resolve) => {
    const materials = readMaterials();
    const initialLength = materials.length;
    const filteredMaterials = materials.filter(m => m.id != id);
    const affectedRows = initialLength - filteredMaterials.length;
    if (affectedRows > 0) {
      const success = writeMaterials(filteredMaterials);
      if (success) {
        resolve({ affectedRows });
      } else {
        throw new Error('删除材料失败');
      }
    } else {
      resolve({ affectedRows: 0 });
    }
  });
}

// 获取所有作品集
function getPortfolios() {
  return new Promise((resolve) => {
    const portfolios = readPortfolios();
    resolve(portfolios);
  });
}

// 获取单个作品集
function getPortfolioById(id) {
  return new Promise((resolve) => {
    const portfolios = readPortfolios();
    const portfolio = portfolios.find(p => p.id == id);
    resolve(portfolio ? [portfolio] : []);
  });
}

// 添加作品集
function addPortfolio(portfolio) {
  return new Promise((resolve) => {
    const portfolios = readPortfolios();
    const newId = portfolios.length > 0 ? Math.max(...portfolios.map(p => p.id)) + 1 : 1;
    const newPortfolio = {
      id: newId,
      ...portfolio,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    portfolios.push(newPortfolio);
    const success = writePortfolios(portfolios);
    if (success) {
      resolve({ insertId: newId });
    } else {
      throw new Error('添加作品集失败');
    }
  });
}

// 更新作品集
function updatePortfolio(id, portfolio) {
  return new Promise((resolve) => {
    const portfolios = readPortfolios();
    const index = portfolios.findIndex(p => p.id == id);
    if (index === -1) {
      resolve({ affectedRows: 0 });
    } else {
      portfolios[index] = {
        ...portfolios[index],
        ...portfolio,
        updated_at: new Date().toISOString()
      };
      const success = writePortfolios(portfolios);
      if (success) {
        resolve({ affectedRows: 1 });
      } else {
        throw new Error('更新作品集失败');
      }
    }
  });
}

// 删除作品集
function deletePortfolio(id) {
  return new Promise((resolve) => {
    const portfolios = readPortfolios();
    const initialLength = portfolios.length;
    const filteredPortfolios = portfolios.filter(p => p.id != id);
    const affectedRows = initialLength - filteredPortfolios.length;
    if (affectedRows > 0) {
      const success = writePortfolios(filteredPortfolios);
      if (success) {
        resolve({ affectedRows });
      } else {
        throw new Error('删除作品集失败');
      }
    } else {
      resolve({ affectedRows: 0 });
    }
  });
}

// 执行查询（模拟）
function query(sql, params) {
  if (sql.startsWith('SELECT * FROM materials')) {
    if (sql.includes('WHERE id = ?')) {
      return getMaterialById(params[0]);
    } else {
      return getMaterials();
    }
  } else if (sql.startsWith('INSERT INTO materials')) {
    const material = {
      name: params[0],
      category: params[1],
      category_name: params[2],
      brand: params[3],
      brand_name: params[4],
      style: params[5],
      price: params[6],
      stock: params[7],
      unit: params[8],
      spec: params[9],
      image: params[10],
      description: params[11]
    };
    return addMaterial(material);
  } else if (sql.startsWith('UPDATE materials')) {
    const id = params[params.length - 1];
    const material = {
      name: params[0],
      category: params[1],
      category_name: params[2],
      brand: params[3],
      brand_name: params[4],
      style: params[5],
      price: params[6],
      stock: params[7],
      unit: params[8],
      spec: params[9],
      image: params[10],
      description: params[11]
    };
    return updateMaterial(id, material);
  } else if (sql.startsWith('DELETE FROM materials')) {
    return deleteMaterial(params[0]);
  } else if (sql.startsWith('SELECT * FROM portfolios')) {
    if (sql.includes('WHERE id = ?')) {
      return getPortfolioById(params[0]);
    } else {
      return getPortfolios();
    }
  } else if (sql.startsWith('INSERT INTO portfolios')) {
    const portfolio = {
      name: params[0],
      style: params[1],
      type: params[2],
      vr_link: params[3],
      image: params[4],
      description: params[5],
      recommended: params[6],
      category: params[7]
    };
    return addPortfolio(portfolio);
  } else if (sql.startsWith('UPDATE portfolios')) {
    const id = params[params.length - 1];
    const portfolio = {
      name: params[0],
      style: params[1],
      type: params[2],
      vr_link: params[3],
      image: params[4],
      description: params[5],
      recommended: params[6],
      category: params[7]
    };
    return updatePortfolio(id, portfolio);
  } else if (sql.startsWith('DELETE FROM portfolios')) {
    return deletePortfolio(params[0]);
  }
  return Promise.resolve([]);
}

// 导出数据库操作对象
module.exports = {
  query
};