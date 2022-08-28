const express = require('express')
const RestaurantList = require('../../models/restaurant-list.js')
const router = express.Router()

// 2.顯示建立餐廳的頁面
router.get('/new', (req, res) => {
  return res.render('new')
})
// 3. 新增餐廳
router.post('/', (req, res) => {
  const restaurant = req.body
  return RestaurantList.create({ ...restaurant })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 4.顯示點選的餐廳詳細資訊頁面
router.get('/:id', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant })
    })
    .catch(error => console.log(error))
})

// 5. 顯示編輯餐廳的頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const isSelected = {}
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => {
      const category = restaurant.category
      switch (category) {
        case '美式':  
          isSelected.American = 1
          break;
        case '咖啡': 
          isSelected.cafe = 1
          break;
        case '中東料理':  
          isSelected.MiddleEastern = 1
          break;
        case '日本料理':  
          isSelected.Japanese = 1
          break;
        case '義式餐廳':  
          isSelected.Italian = 1
          break;
        case '酒吧':  
          isSelected.pub = 1
          break;
        case '其他':  
          isSelected.other = 1
          break;
      }
      res.render('edit', { restaurant, isSelected })
    })
    .catch(error => console.log(error))
})

// 6. 編輯餐廳
router.put('/:id', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .then(restaurant => {
      Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 7. 刪除餐廳
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .then(restaurant => {
      restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// 8.顯示符合搜尋關鍵字的餐廳清單
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  if (!keyword) {
    res.redirect('/')
  }
  return RestaurantList.find()
    .lean()
    .then(restaurants => {
      const filteredRestaurants = restaurants.filter(d => {
        return d.name.toLowerCase().includes(keyword) || d.name_en.toLowerCase().includes(keyword) || d.category.toLowerCase().includes(keyword)
      })
      res.render('index', { restaurants: filteredRestaurants })
    })
    .catch(error => console.log(error))
})

module.exports = router
